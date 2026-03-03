import json
from datetime import datetime as real_datetime, timezone
from pathlib import Path

import pytest

import record_session


class FixedDateTime(real_datetime):
    @classmethod
    def now(cls, tz=None):
        base = real_datetime(2024, 1, 2, 3, 4, 5, tzinfo=timezone.utc)
        if tz is not None:
            return base.astimezone(tz)
        return base


@pytest.fixture(autouse=True)
def restore_datetime(monkeypatch):
    original_datetime = record_session.datetime
    yield
    monkeypatch.setattr(record_session, "datetime", original_datetime)


def test_prepare_session_dir_handles_collisions(tmp_path, monkeypatch):
    monkeypatch.setattr(record_session, "datetime", FixedDateTime)
    first_path = tmp_path / "20240102_030405"
    first_path.mkdir()

    session_paths = record_session.prepare_session_dir(tmp_path)

    assert session_paths.root.name == "20240102_030405_01"
    assert session_paths.audio.name == "20240102_030405_01.wav"


def test_run_session_creates_expected_outputs(tmp_path, monkeypatch):
    def fake_record_audio(audio_path: Path, **_kwargs):
        audio_path.write_bytes(b"FAKE")
        return {
            "recording_started_at": "2024-01-02T03:04:05",
            "recording_ended_at": "2024-01-02T03:04:10",
            "duration_seconds": 5.0,
            "status_messages": [],
            "frames": 8000,
        }

    def fake_transcribe_audio(_model, _audio_path: Path):
        return {
            "text": "hello world",
            "language": "en",
            "duration": 5.0,
            "segments": [
                {"id": 0, "start": 0.0, "end": 5.0, "text": "hello world"}
            ],
        }

    def fake_summarise(_transcript, _client, model_name, _temperature):
        return {"summary": "Key points", "model": model_name}

    monkeypatch.setattr(record_session, "record_audio", fake_record_audio)
    monkeypatch.setattr(record_session, "load_whisper_model", lambda name: object())
    monkeypatch.setattr(record_session, "transcribe_audio", fake_transcribe_audio)
    monkeypatch.setattr(record_session, "summarise_transcript", fake_summarise)
    monkeypatch.setattr(record_session, "maybe_create_openai_client", lambda skip: object())

    result = record_session.run_session(output_dir=tmp_path, summary_model="test-model")

    paths = result["paths"]
    metadata_path = paths.metadata
    summary_path = paths.summary
    transcript_path = paths.transcript
    note_path = paths.root / "session.txt"

    assert metadata_path.exists()
    assert summary_path.exists()
    assert transcript_path.exists()
    assert note_path.exists()

    metadata = json.loads(metadata_path.read_text())
    assert metadata["recording"]["frames"] == 8000
    assert metadata["transcription"]["language"] == "en"
    assert metadata["summary"]["model"] == "test-model"

    assert "Key points" in summary_path.read_text()
    assert "hello world" in transcript_path.read_text()
    assert "hello world" in note_path.read_text()


def test_run_session_respects_skip_summary(tmp_path, monkeypatch):
    monkeypatch.setattr(
        record_session,
        "record_audio",
        lambda audio_path, **_: {
            "recording_started_at": "2024-01-02T03:04:05",
            "recording_ended_at": "2024-01-02T03:04:05",
            "duration_seconds": 0.0,
            "status_messages": [],
            "frames": 0,
        },
    )
    monkeypatch.setattr(record_session, "load_whisper_model", lambda name: object())
    monkeypatch.setattr(
        record_session,
        "transcribe_audio",
        lambda model, audio_path: {"text": "", "language": None, "duration": 0, "segments": []},
    )
    monkeypatch.setattr(record_session, "maybe_create_openai_client", lambda skip: None)

    result = record_session.run_session(output_dir=tmp_path, skip_summary=True)

    summary = result["summary"]
    assert summary.get("summary") == ""
    # Without transcript text, the helper bails out early.
    assert summary.get("error") == "Transcript empty."
