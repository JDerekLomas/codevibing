from __future__ import annotations

import os
from pathlib import Path
from typing import List, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv

# Configuration
BASE_DIR = Path(__file__).resolve().parent.parent
PROMPTS_DIR = BASE_DIR / "prompts"
FRONTEND_DIR = BASE_DIR / "frontend"
DEFAULT_MODEL = "gpt-4o-mini"
DEFAULT_TEMPERATURE = 0.6

# Ensure prompts directory exists
if not PROMPTS_DIR.exists():
    raise RuntimeError(f"Prompts directory not found at {PROMPTS_DIR}")

load_dotenv()

_client: OpenAI | None = None

app = FastAPI(title="AI Literacy Chat Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(..., min_length=1)


class ChatRequest(BaseModel):
    messages: List[Message]
    model: Optional[str] = None
    temperature: Optional[float] = Field(default=None, ge=0, le=2)


class ChatResponse(BaseModel):
    message: Message
    usage: Optional[dict] = None


def list_prompt_files() -> List[Path]:
    return sorted(PROMPTS_DIR.glob("*.txt"))


def slug_from_path(path: Path) -> str:
    return path.stem


def friendly_name_from_slug(slug: str) -> str:
    return slug.replace("_", " ").title()


def get_openai_client() -> OpenAI:
    global _client
    if _client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="Server missing OpenAI API key")
        _client = OpenAI(api_key=api_key)
    return _client


@app.get("/api/prompts")
def get_prompts():
    prompts = []
    for prompt_path in list_prompt_files():
        slug = slug_from_path(prompt_path)
        prompts.append(
            {
                "slug": slug,
                "name": friendly_name_from_slug(slug),
            }
        )
    return {"prompts": prompts}


@app.get("/api/prompts/{slug}")
def get_prompt(slug: str):
    safe_slug = slug.replace("..", "")
    prompt_path = PROMPTS_DIR / f"{safe_slug}.txt"
    if not prompt_path.exists():
        raise HTTPException(status_code=404, detail="Prompt not found")

    content = prompt_path.read_text(encoding="utf-8")
    return {
        "slug": safe_slug,
        "name": friendly_name_from_slug(safe_slug),
        "content": content,
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.messages:
        raise HTTPException(status_code=400, detail="At least one message is required")

    model = request.model or DEFAULT_MODEL
    temperature = request.temperature if request.temperature is not None else DEFAULT_TEMPERATURE

    formatted_messages = [
        {"role": message.role, "content": message.content}
        for message in request.messages
    ]

    client = get_openai_client()

    try:
        response = client.chat.completions.create(
            model=model,
            messages=formatted_messages,
            temperature=temperature,
        )
    except Exception as exc:  # pragma: no cover - API errors surfaced to user
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    if not response.choices:
        raise HTTPException(status_code=502, detail="Empty response from model")

    assistant_message = response.choices[0].message.content or ""
    assistant_message = assistant_message.strip()
    if not assistant_message:
        raise HTTPException(status_code=502, detail="Empty response from model")

    usage_data = None
    if response.usage is not None:
        usage_data = response.usage.model_dump()

    return ChatResponse(
        message=Message(role="assistant", content=assistant_message),
        usage=usage_data,
    )


@app.get("/health")
def health_check():
    return {"status": "ok"}


if FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
