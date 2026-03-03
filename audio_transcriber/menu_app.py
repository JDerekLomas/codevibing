#!/usr/bin/env python3
"""macOS menu bar controller for the audio recorder."""
from __future__ import annotations

import os
import subprocess
import sys
import threading
from pathlib import Path
from typing import Optional

import rumps

from record_session import run_session


def determine_sessions_dir() -> Path:
    env_override = os.environ.get("AUDIO_TRANSCRIBER_SESSIONS_DIR")
    if env_override:
        return Path(env_override).expanduser()
    if getattr(sys, "frozen", False):
        return Path.home() / "AudioTranscriber" / "sessions"
    return Path(__file__).resolve().parent / "sessions"
ICON_IDLE = "🎙️"
ICON_ACTIVE = "⏺"


class SessionWorker(threading.Thread):
    """Background thread that executes a recording session."""

    def __init__(self, *, output_dir: Path, skip_summary: bool) -> None:
        super().__init__(daemon=True)
        self.output_dir = output_dir
        self.skip_summary = skip_summary
        self.stop_event = threading.Event()
        self.result: Optional[dict] = None
        self.error: Optional[Exception] = None

    def stop(self) -> None:
        self.stop_event.set()

    def run(self) -> None:  # noqa: D401
        try:
            self.result = run_session(
                output_dir=self.output_dir,
                skip_summary=self.skip_summary,
                stop_event=self.stop_event,
            )
        except Exception as exc:  # noqa: BLE001
            self.error = exc


class AudioTranscriberMenuApp(rumps.App):
    """Lightweight status-bar shell for the recorder."""

    def __init__(self) -> None:
        super().__init__(name="AudioTranscriber", title=ICON_IDLE)
        self.worker: Optional[SessionWorker] = None
        self.last_session_path: Optional[Path] = None
        self.sessions_dir = determine_sessions_dir()

        self.status_item = rumps.MenuItem("Status: Idle")
        self.start_item = rumps.MenuItem("Start Recording", callback=self.start_recording)
        self.stop_item = rumps.MenuItem("Stop Recording", callback=self.stop_recording, enabled=False)
        self.open_item = rumps.MenuItem("Open Sessions Folder", callback=self.open_sessions_folder)
        self.skip_summary_item = rumps.MenuItem("Skip LLM Summary", callback=self.toggle_skip_summary)
        self.skip_summary_item.state = False
        self.last_session_item = rumps.MenuItem("Last Session: –", callback=self.open_last_session, enabled=False)

        self.menu = [
            self.status_item,
            self.start_item,
            self.stop_item,
            None,
            self.open_item,
            self.last_session_item,
            self.skip_summary_item,
        ]

        self.timer = rumps.Timer(self.poll_worker, 0.5)
        self.timer.start()

    def start_recording(self, _sender) -> None:
        if self.worker is not None:
            return
        sessions_dir = self.sessions_dir.expanduser()
        sessions_dir.mkdir(parents=True, exist_ok=True)
        sessions_dir = sessions_dir.resolve()
        self.sessions_dir = sessions_dir
        skip_summary = bool(self.skip_summary_item.state)
        self.worker = SessionWorker(output_dir=sessions_dir, skip_summary=skip_summary)
        self.worker.start()
        self.status_item.title = "Status: Recording"
        self.title = ICON_ACTIVE
        self.start_item.enabled = False
        self.stop_item.enabled = True

    def stop_recording(self, _sender) -> None:
        if self.worker is None:
            return
        self.worker.stop()
        self.stop_item.enabled = False
        self.status_item.title = "Status: Wrapping up"

    def open_sessions_folder(self, _sender) -> None:
        sessions_dir = self.sessions_dir.expanduser()
        sessions_dir.mkdir(parents=True, exist_ok=True)
        subprocess.run(["open", str(sessions_dir)], check=False)

    def open_last_session(self, _sender) -> None:
        if self.last_session_path is None:
            return
        subprocess.run(["open", str(self.last_session_path)], check=False)

    def toggle_skip_summary(self, sender: rumps.MenuItem) -> None:
        sender.state = not sender.state

    def poll_worker(self, _timer) -> None:
        if self.worker is None:
            return
        if self.worker.is_alive():
            return
        result = self.worker.result
        error = self.worker.error
        self.worker = None
        self.title = ICON_IDLE
        self.start_item.enabled = True
        self.stop_item.enabled = False

        if error:
            self.status_item.title = "Status: Error"
            rumps.notification(
                "Audio Transcriber",
                "Recording failed",
                str(error),
            )
            return

        if not result:
            self.status_item.title = "Status: Cancelled"
            return

        paths = result.get("paths")
        summary = result.get("summary", {})
        session_dir = getattr(paths, "root", None)
        if isinstance(session_dir, Path):
            self.last_session_path = session_dir
            self.last_session_item.title = f"Last Session: {session_dir.name}"
            self.last_session_item.enabled = True

        summary_text = summary.get("summary") or "No summary generated."
        rumps.notification(
            "Audio Transcriber",
            "Session saved",
            summary_text[:200],
        )
        self.status_item.title = "Status: Idle"


def main() -> None:
    app = AudioTranscriberMenuApp()
    app.run()


if __name__ == "__main__":
    main()
