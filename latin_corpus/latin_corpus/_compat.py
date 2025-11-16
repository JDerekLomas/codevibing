"""Compatibility helpers for optional runtime dependencies."""

from __future__ import annotations

from importlib import import_module
from types import ModuleType


class MissingDependencyError(RuntimeError):
    """Raised when a required optional dependency is unavailable."""


def require_pandas() -> ModuleType:
    """Return the :mod:`pandas` module or raise a helpful error message.

    The toolkit leans heavily on pandas for all tabular operations. When the
    dependency is not installed, importing modules that rely on pandas results
    in an opaque ``ModuleNotFoundError``. Centralising the import behind this
    helper lets us surface an actionable instruction for users instead.
    """

    try:
        return import_module("pandas")
    except ModuleNotFoundError as exc:  # pragma: no cover - import-time guard
        raise MissingDependencyError(
            "pandas is required for the latin_corpus toolkit. Install the "
            "dependencies via 'pip install -r requirements.txt' before running "
            "the pipeline."
        ) from exc


__all__ = ["MissingDependencyError", "require_pandas"]

