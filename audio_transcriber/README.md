# Audio Transcriber

A minimal CLI for capturing audio, transcribing it immediately with Whisper, and archiving the results with timestamps, metadata, and an optional LLM-generated summary. Output is written to disk so the transcript never clutters your terminal.

## Features
- Records from the system default (or user-chosen) microphone until a duration elapses or you press `Ctrl+C`.
- Saves a high-quality WAV file alongside the transcription, summary, and metadata.
- Generates `session.txt`, `transcript.txt`, `summary.txt`, and `metadata.json` inside a timestamped folder.
- Produces a concise summary through OpenAI's Responses API (can be skipped).
- Captures Whisper segment timings for later reference without displaying the text on screen.

## Prerequisites
- Python 3.10 or newer.
- `ffmpeg` available on your system (required by `openai-whisper`). On macOS: `brew install ffmpeg`.
- An OpenAI API key exported as `OPENAI_API_KEY` if you want summaries. Summaries can be skipped with `--skip-summary`.

## Setup
```bash
cd /Users/dereklomas/CodeVibing/audio_transcriber
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

The first transcription run will download the Whisper model you choose (`base` by default). Subsequent runs reuse the cached model.

## Usage
```bash
python record_session.py run [OPTIONS]
```

Common options:
- `--duration 120` – stop recording after 120 seconds (otherwise use `Ctrl+C`).
- `--sample-rate 16000` – customise the sample rate.
- `--channels 1` – set channel count (1 = mono, 2 = stereo).
- `--whisper-model base` – pick a Whisper model (`tiny`, `small`, `medium`, `large`, etc.).
- `--audio-device "CoreAudio"` – select an input device recognised by `sounddevice`.
- `--summary-model gpt-4o-mini` – change the LLM model for summaries.
- `--skip-summary` – disable summary generation entirely.

Example session that records until you press `Ctrl+C`:
```bash
python record_session.py run --whisper-model base
```

Example two-minute capture with a custom Whisper size and skipped summary:
```bash
python record_session.py run --duration 120 --whisper-model small --skip-summary
```

### Menu Bar UI (macOS)
Launch the lightweight status-bar controller after activating your virtualenv:

```bash
python menu_app.py
```

An icon (`🎙️` idle, `⏺` while capturing) appears in the macOS menu bar.
- **Start Recording** begins an open-ended session you can stop from the menu.
- **Stop Recording** requests a graceful stop and waits for transcription/summary.
- **Open Sessions Folder** jumps to the archive location in Finder.
- **Last Session** points directly to the most recent run.
- **Skip LLM Summary** toggles whether summaries are generated on new sessions.

Notifications confirm when a session is saved; the transcript itself remains file-only.

### Build a Standalone `.app`
You can package the menu bar controller as a native macOS app (py2app ≥ 0.28):

```bash
source .venv/bin/activate
pip install py2app
python setup.py py2app
```

The build artefacts appear in `dist/AudioTranscriber.app`; drag this into `/Applications` for quick access. The bundle runs silently in the menu bar (no Dock icon). Use the environment variable `AUDIO_TRANSCRIBER_SESSIONS_DIR` if you want to change where session folders are stored (defaults to `~/AudioTranscriber/sessions` when bundled).

## Tests
```bash
source .venv/bin/activate
python -m pip install pytest
pytest
```

## Output Layout
Each run creates `sessions/<timestamp>/` containing:
- `<timestamp>.wav` – the recorded audio.
- `transcript.txt` – the Whisper transcript (not printed to the terminal).
- `summary.txt` – LLM response with model metadata.
- `session.txt` – human-friendly note including metadata, summary, and transcript.
- `metadata.json` – structured JSON with recording details, Whisper segments, and summary status.

The CLI prints only high-level status updates so transcripts stay off-screen.

## Tips
- Run `python -m sounddevice` to list audio devices if you need the exact input name.
- If you change sample rates or devices frequently, create shell aliases with your preferred options.
- Store your OpenAI key in a `.env` file and load it before running (supported automatically via the OpenAI SDK environment lookup).
