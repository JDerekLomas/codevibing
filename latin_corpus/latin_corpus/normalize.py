"""Normalisation helpers for bibliographic metadata."""

from __future__ import annotations

import re
import string
from typing import Iterable, Optional

from unidecode import unidecode

# Configuration values collected in a dictionary for quick adjustments.
CONFIG = {
    "author_honorifics": (
        "dr",
        "prof",
        "professor",
        "rev",
        "reverend",
        "sir",
        "dom",
        "fr",
        "fra",
    ),
    "title_leading_stopwords": (
        "de",
        "in",
        "ad",
        "liber",
    ),
    "punctuation_preserve_title": {":", ","},
}

PUNCTUATION_TABLE_AUTHOR = str.maketrans({ch: " " for ch in string.punctuation})
PUNCTUATION_TABLE_TITLE = str.maketrans(
    {ch: " " for ch in string.punctuation if ch not in CONFIG["punctuation_preserve_title"]}
)

LANGUAGE_MAP = {
    "lat": "Latin",
    "la": "Latin",
    "latin": "Latin",
    "latine": "Latin",
    "latius": "Latin",
}

YEAR_PATTERN = re.compile(r"(1[45-9]\d{2})")


def _normalise_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def _strip_honorifics(value: str, honorifics: Iterable[str]) -> str:
    pattern = r"^(?:(?:" + "|".join(map(re.escape, honorifics)) + r")\.?,?\s+)+"
    return re.sub(pattern, "", value)


def normalize_author(name: Optional[str]) -> str:
    """Return a lowercased, ASCII-fied author string without honorifics."""

    if not name:
        return ""
    value = unidecode(str(name)).lower()
    value = _strip_honorifics(value, CONFIG["author_honorifics"])
    value = value.translate(PUNCTUATION_TABLE_AUTHOR)
    return _normalise_whitespace(value)


def normalize_title(title: Optional[str]) -> str:
    """Return a normalised title suitable for matching across catalogues."""

    if not title:
        return ""
    value = unidecode(str(title)).lower()
    value = value.translate(PUNCTUATION_TABLE_TITLE)
    value = _normalise_whitespace(value)

    for stopword in CONFIG["title_leading_stopwords"]:
        if value.startswith(f"{stopword} "):
            value = value[len(stopword) + 1 :]
            break

    return value


def extract_year(value: Optional[str | int | float]) -> Optional[int]:
    """Extract the first plausible Gregorian year (1450–1999) from ``value``."""

    if value is None or value != value:  # NaN check
        return None

    if isinstance(value, (int, float)) and not isinstance(value, bool):
        int_value = int(value)
        if 1450 <= int_value <= 1900:
            return int_value
        return None

    text = unidecode(str(value))
    match = YEAR_PATTERN.search(text)
    if not match:
        return None
    year = int(match.group(1))
    return year if 1450 <= year <= 1900 else None


def standardize_language_label(label: Optional[str]) -> Optional[str]:
    """Map language codes and descriptors to canonical names."""

    if not label:
        return None
    cleaned = unidecode(label).lower().strip()
    if cleaned in LANGUAGE_MAP:
        return LANGUAGE_MAP[cleaned]
    if cleaned.startswith("lat"):
        return "Latin"
    return label.strip()


__all__ = [
    "CONFIG",
    "extract_year",
    "normalize_author",
    "normalize_title",
    "standardize_language_label",
]
