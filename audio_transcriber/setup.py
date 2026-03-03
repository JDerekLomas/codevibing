import sys

from setuptools import setup


sys.setrecursionlimit(10000)

APP = ["menu_app.py"]
OPTIONS = {
    "argv_emulation": False,
    "packages": [
        "numpy",
        "sounddevice",
        "soundfile",
        "typer",
        "openai",
        "whisper",
        "rumps",
    ],
    "plist": {
        "LSUIElement": True,
        "CFBundleName": "AudioTranscriber",
        "CFBundleDisplayName": "AudioTranscriber",
        "CFBundleIdentifier": "com.codevibing.audiotranscriber",
        "CFBundleShortVersionString": "0.1.0",
        "CFBundleVersion": "0.1.0",
    },
}

setup(
    name="AudioTranscriber",
    app=APP,
    options={"py2app": OPTIONS},
    setup_requires=["py2app"],
)
