#!/usr/bin/env python3
"""Minimal smoketest against DashScope's OpenAI-compatible endpoint."""
import json
import os
import sys
from datetime import datetime
from textwrap import indent

import requests

API_KEY_ENV = "DASHSCOPE_API_KEY"
API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
DEFAULT_MODEL = "qwen2.5-72b-instruct"

def main() -> int:
    api_key = os.environ.get(API_KEY_ENV)
    if not api_key:
        print(f"Missing {API_KEY_ENV} env var", file=sys.stderr)
        return 1

    payload = {
        "model": os.environ.get("QWEN_MODEL", DEFAULT_MODEL),
        "messages": [
            {"role": "system", "content": "You are a concise assistant helping with a smoke test."},
            {"role": "user", "content": "What is the current UTC year?"},
        ],
        "max_tokens": 128,
        "temperature": 0,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "X-DashScope-SSE": "disable",
    }

    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
    except requests.HTTPError as exc:
        print(f"HTTP error: {exc.response.status_code} {exc.response.text}", file=sys.stderr)
        return 2
    except requests.RequestException as exc:
        print(f"Request error: {exc}", file=sys.stderr)
        return 3

    try:
        data = response.json()
    except json.JSONDecodeError:
        print(f"Invalid JSON response:\n{response.text}", file=sys.stderr)
        return 4

    choice = (data.get("choices") or [{}])[0]
    message = choice.get("message", {}).get("content")
    usage = data.get("usage", {})

    print("Model:", data.get("model", payload["model"]))
    print("Created:", datetime.utcfromtimestamp(data.get("created", 0)).isoformat() if data.get("created") else "?")
    if message:
        print("Response:\n" + indent(message.strip(), "  "))
    else:
        print("No message returned; raw data:\n" + indent(json.dumps(data, indent=2), "  "))

    if usage:
        print("Usage:")
        for key in ("prompt_tokens", "completion_tokens", "total_tokens"):
            if key in usage:
                print(f"  {key}: {usage[key]}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
