"""Priority scoring utilities for the Latin master table."""

from __future__ import annotations

from typing import Mapping, MutableMapping, Optional

from ._compat import require_pandas

pd = require_pandas()


PRIORITY_WEIGHTS: Mapping[str, float] = {
    "missing_facsimile": 2.0,
    "missing_translation": 2.0,
    "scientific": 1.0,
    "hermetic": 1.0,
    "colonial": 1.0,
    "early_modern_peak": 1.0,
}

KEYWORD_GROUPS: Mapping[str, tuple[str, ...]] = {
    "scientific": ("astronom", "physic", "medic", "anatom", "botan", "mathemat"),
    "hermetic": ("hermet", "alchem", "cabal", "magia", "occult"),
    "colonial": ("india", "china", "mexic", "peru", "brazil", "goa", "iapon", "japan"),
}

EARLY_MODERN_RANGE: tuple[int, int] = (1500, 1650)


def _ensure_columns(frame: pd.DataFrame) -> pd.DataFrame:
    defaults = {
        "has_digital_facsimile": False,
        "has_modern_translation": False,
        "subjects": "",
        "title": "",
        "priority_score": 0.0,
        "priority_tags": "",
    }
    for col, default in defaults.items():
        if col not in frame.columns:
            frame[col] = default
    return frame


def _detect_keyword_tags(text: str) -> set[str]:
    if not text:
        return set()
    lowered = text.lower()
    tags = {name for name, keywords in KEYWORD_GROUPS.items() if any(keyword in lowered for keyword in keywords)}
    return tags


def add_priority_scores(master_df: pd.DataFrame, *, weights: Optional[Mapping[str, float]] = None) -> pd.DataFrame:
    """Compute priority scores and tags for ``master_df``."""

    if master_df.empty:
        result = master_df.copy()
        result["priority_score"] = pd.Series(dtype=float)
        result["priority_tags"] = pd.Series(dtype=str)
        return result

    working = _ensure_columns(master_df.copy())
    applied_weights: MutableMapping[str, float] = dict(PRIORITY_WEIGHTS)
    if weights:
        applied_weights.update(weights)

    scores = []
    tags_list = []
    lower_bound, upper_bound = EARLY_MODERN_RANGE

    for _, row in working.iterrows():
        score = 0.0
        tags: list[str] = []

        if not bool(row.get("has_digital_facsimile", False)):
            score += applied_weights["missing_facsimile"]
            tags.append("unscanned")

        if not bool(row.get("has_modern_translation", False)):
            score += applied_weights["missing_translation"]
            tags.append("untranslated")

        text_blob = f"{row.get('title', '')} {row.get('subjects', '')}".strip()
        for keyword_tag in _detect_keyword_tags(text_blob):
            score += applied_weights.get(keyword_tag, 0.0)
            tags.append(keyword_tag)

        imprint_year = row.get("imprint_year")
        if pd.notna(imprint_year):
            try:
                year_int = int(imprint_year)
            except (TypeError, ValueError):
                year_int = None
            if year_int is not None and lower_bound <= year_int <= upper_bound:
                score += applied_weights["early_modern_peak"]
                tags.append("early_modern_peak")

        scores.append(score)
        tags_list.append(";".join(sorted(dict.fromkeys(tags))))

    working["priority_score"] = scores
    working["priority_tags"] = tags_list

    return working


__all__ = ["add_priority_scores", "PRIORITY_WEIGHTS", "KEYWORD_GROUPS", "EARLY_MODERN_RANGE"]
