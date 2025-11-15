"""Utility package for constructing a Latin bibliography master table."""

from __future__ import annotations

from importlib import import_module
from typing import Any

__all__ = [
    "add_priority_scores",
    "add_translation_flags",
    "build_master_bibliography",
    "build_translation_index",
    "run_pipeline",
]


_MODULE_MAP = {
    "run_pipeline": (".main", "run_pipeline"),
    "build_master_bibliography": (".merge", "build_master_bibliography"),
    "add_priority_scores": (".priority", "add_priority_scores"),
    "add_translation_flags": (".translation_match", "add_translation_flags"),
    "build_translation_index": (".translation_match", "build_translation_index"),
}


def __getattr__(name: str) -> Any:  # pragma: no cover - dynamic import glue
    try:
        module_name, attr = _MODULE_MAP[name]
    except KeyError as exc:
        raise AttributeError(f"module 'latin_corpus' has no attribute {name!r}") from exc
    module = import_module(module_name, package=__name__)
    return getattr(module, attr)
