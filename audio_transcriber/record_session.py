#!/usr/bin/env python3
"""Record audio sessions, transcribe them locally, and generate metadata-rich notes."""
from __future__ import annotations

import json
import queue
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

import numpy as np
import sounddevice as sd
import soundfile as sf
import typer
import whisper
from openai import OpenAI
from openai.types import Response

app = typer.Typer(help="Capture an audio session and archive the transcription with metadata.")


@dataclass
class SessionPaths:
    root: Path
    audio: Path
    transcript: Path
    summary: Path
    metadata: Path


def prepare_session_dir(base_dir: Path) -> SessionPaths:
    timestamp = datetime.now(timezone.utc).astimezone()
    session_id = timestamp.strftime("%Y%m%d_%H%M%S")
    session_dir = base_dir / session_id
    suffix = 1
    while session_dir.exists():
        session_dir = base_dir / f"{session_id}_{suffix:02d}"
        suffix += 1
    session_dir.mkdir(parents=True, exist_ok=False)
    session_name = session_dir.name
    return SessionPaths(
        root=session_dir,
        audio=session_dir / f"{session_name}.wav",
        transcript=session_dir / "transcript.txt",
        summary=session_dir / "summary.txt",
        metadata=session_dir / "metadata.json",
    )


def record_audio(
    output_path: Path,
    sample_rate: int,
    channels: int,
    duration: Optional[float],
    device: Optional[str],
    stop_event: Optional[threading.Event] = None,
) -> Dict[str, Any]:
    if device is not None:
        sd.default.device = device

    recorder_queue: "queue.Queue[np.ndarray]" = queue.Queue()
    frames_written = 0
    start_time = datetime.now(timezone.utc).astimezone()
    status_messages = []

    def callback(indata: np.ndarray, frames: int, time_info: Any, status: sd.CallbackFlags) -> None:
        if status:
            status_messages.append(str(status))
        recorder_queue.put(indata.copy())

    typer.echo(
        "Recording… press Ctrl+C to stop."
        if duration is None and stop_event is None
        else f"Recording for {duration:.1f} seconds…"
    )

    with sf.SoundFile(
        output_path,
        mode="x",
        samplerate=sample_rate,
        channels=channels,
        subtype="PCM_16",
    ) as wav_file:
        with sd.InputStream(
            samplerate=sample_rate,
            channels=channels,
            dtype="float32",
            callback=callback,
        ) as stream:
            start_ts = time.monotonic()
            try:
                while True:
                    if stop_event and stop_event.is_set():
                        stream.stop(ignore_errors=True)
                        break
                    try:
                        data = recorder_queue.get(timeout=0.1)
                        wav_file.write(data)
                        frames_written += len(data)
                    except queue.Empty:
                        if not stream.active:
                            break
                        continue

                    if duration is not None and (time.monotonic() - start_ts) >= duration:
                        stream.stop(ignore_errors=True)
                        break
            except KeyboardInterrupt:
                stream.stop(ignore_errors=True)

        # Drain anything that arrived after stopping the stream.
        while not recorder_queue.empty():
            data = recorder_queue.get_nowait()
            wav_file.write(data)
            frames_written += len(data)

    end_time = datetime.now(timezone.utc).astimezone()
    actual_duration = frames_written / float(sample_rate)
    return {
        "recording_started_at": start_time.isoformat(),
        "recording_ended_at": end_time.isoformat(),
        "duration_seconds": actual_duration,
        "status_messages": status_messages,
        "frames": frames_written,
    }


def load_whisper_model(model_name: str) -> whisper.Whisper:
    typer.echo(f"Loading Whisper model '{model_name}'…")
    return whisper.load_model(model_name)


def transcribe_audio(model: whisper.Whisper, audio_path: Path) -> Dict[str, Any]:
    typer.echo("Transcribing audio…")
    result = model.transcribe(
        str(audio_path),
        verbose=False,
        without_timestamps=False,
    )
    segments = [
        {
            "id": seg["id"],
            "start": seg["start"],
            "end": seg["end"],
            "text": seg["text"].strip(),
        }
        for seg in result.get("segments", [])
    ]
    return {
        "text": result.get("text", "").strip(),
        "language": result.get("language"),
        "duration": result.get("duration"),
        "segments": segments,
    }


def summarise_transcript(
    transcript: str,
    openai_client: Optional[OpenAI],
    model_name: str,
    temperature: float,
) -> Dict[str, Any]:
    if not transcript:
        return {"summary": "", "model": model_name, "error": "Transcript empty."}

    if openai_client is None:
        return {"summary": "", "model": model_name, "error": "OpenAI client not configured."}

    system_prompt = (
        "You are an expert note taker. Generate a concise summary (<=120 words) with key points "
        "and action items if present. Do not mention transcription artefacts."
    )
    user_prompt = (
        "Here is an automatically generated transcript of an audio recording. Summarise the "
        "content for future reference.\n\nTranscript:\n" + transcript
    )

    try:
        response: Response = openai_client.responses.create(
            model=model_name,
            input=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            max_output_tokens=400,
        )
        summary_text = response.output_text.strip()
        return {"summary": summary_text, "model": model_name}
    except Exception as exc:  # noqa: BLE001
        return {"summary": "", "model": model_name, "error": str(exc)}


def write_outputs(paths: SessionPaths, transcript: str, summary: Dict[str, Any], metadata: Dict[str, Any]) -> None:
    paths.transcript.write_text(transcript, encoding="utf-8")

    summary_payload = summary.get("summary", "")
    summary_lines = [
        f"Summary generated at {datetime.now(timezone.utc).astimezone().isoformat()}",
        f"Model: {summary.get('model')}",
    ]
    if summary_payload:
        summary_lines.append("")
        summary_lines.append(summary_payload)
    else:
        summary_lines.append("\n(No summary available.)")
    paths.summary.write_text("\n".join(summary_lines), encoding="utf-8")

    paths.metadata.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    session_note = (
        f"Session ID: {paths.root.name}\n"
        f"Created: {metadata['recording']['recording_started_at']}\n"
        f"Duration (s): {metadata['recording']['duration_seconds']:.2f}\n"
        f"Language: {metadata['transcription'].get('language', 'unknown')}\n"
        "\nSummary:\n"
        f"{summary.get('summary', '').strip() or '(not available)'}\n"
        "\nTranscript:\n"
        f"{transcript.strip()}\n"
    )
    note_path = paths.root / "session.txt"
    note_path.write_text(session_note, encoding="utf-8")


def maybe_create_openai_client(skip_summary: bool) -> Optional[OpenAI]:
    if skip_summary:
        return None
    try:
        return OpenAI()
    except Exception:  # noqa: BLE001
        return None


def run_session(
    *,
    duration: Optional[float] = None,
    sample_rate: int = 16000,
    channels: int = 1,
    whisper_model: str = "base",
    summary_model: str = "gpt-4o-mini",
    temperature: float = 0.2,
    output_dir: Path = Path("sessions"),
    audio_device: Optional[str] = None,
    skip_summary: bool = False,
    stop_event: Optional[threading.Event] = None,
) -> Dict[str, Any]:
    output_dir = Path(output_dir).expanduser()
    output_dir.mkdir(parents=True, exist_ok=True)
    output_dir = output_dir.resolve()
    paths = prepare_session_dir(output_dir)

    recording_info = record_audio(
        paths.audio,
        sample_rate=sample_rate,
        channels=channels,
        duration=duration,
        device=audio_device,
        stop_event=stop_event,
    )

    model = load_whisper_model(whisper_model)
    transcription = transcribe_audio(model, paths.audio)

    openai_client = maybe_create_openai_client(skip_summary)
    summary = summarise_transcript(
        transcription.get("text", ""),
        openai_client=openai_client,
        model_name=summary_model,
        temperature=temperature,
    )

    metadata: Dict[str, Any] = {
        "session_id": paths.root.name,
        "created_at": datetime.now(timezone.utc).astimezone().isoformat(),
        "audio_file": str(paths.audio),
        "transcript_file": str(paths.transcript),
        "summary_file": str(paths.summary),
        "note_file": str((paths.root / "session.txt")),
        "recording": recording_info,
        "transcription": {
            "model": whisper_model,
            "language": transcription.get("language"),
            "duration_seconds": transcription.get("duration"),
            "segments": transcription.get("segments", []),
        },
        "summary": summary,
    }

    write_outputs(paths, transcription.get("text", ""), summary, metadata)

    return {
        "paths": paths,
        "metadata": metadata,
        "summary": summary,
        "transcription": transcription,
    }


@app.command()
def run(
    duration: Optional[float] = typer.Option(
        None,
        help="Recording length in seconds. Leave unset to stop manually with Ctrl+C.",
    ),
    sample_rate: int = typer.Option(16000, help="Audio sample rate."),
    channels: int = typer.Option(1, help="Number of input channels."),
    whisper_model: str = typer.Option("base", help="Whisper model size to load."),
    summary_model: str = typer.Option(
        "gpt-4o-mini",
        help="LLM model name for generating the summary.",
    ),
    temperature: float = typer.Option(0.2, help="Summary generation temperature."),
    output_dir: Path = typer.Option(Path("sessions"), help="Directory to store session archives."),
    audio_device: Optional[str] = typer.Option(
        None,
        help="sounddevice input identifier. Leave unset for default.",
    ),
    skip_summary: bool = typer.Option(False, help="Skip LLM summary generation."),
) -> None:
    result = run_session(
        duration=duration,
        sample_rate=sample_rate,
        channels=channels,
        whisper_model=whisper_model,
        summary_model=summary_model,
        temperature=temperature,
        output_dir=output_dir,
        audio_device=audio_device,
        skip_summary=skip_summary,
    )

    paths: SessionPaths = result["paths"]
    summary = result["summary"]
    recording_info = result["metadata"]["recording"]

    typer.echo(f"Session archived: {paths.root}")
    if summary.get("error"):
        typer.echo(f"Summary warning: {summary['error']}")
    if recording_info.get("status_messages"):
        typer.echo("Audio interface notices were captured in metadata.")


if __name__ == "__main__":
    app()
