"""Utilities for matching Latin works to modern translations."""

from __future__ import annotations

import logging
from typing import Iterable, Mapping, MutableMapping, Optional

from ._compat import require_pandas

pd = require_pandas()

from .normalize import normalize_author, normalize_title

LOGGER = logging.getLogger(__name__)


TRANSLATION_INDEX_COLUMNS: tuple[str, ...] = (
    "series_name",
    "latin_author_norm",
    "latin_title_norm",
    "modern_language",
    "translation_year",
)


DEFAULT_MATCH_CONFIG: Mapping[str, object] = {
    "enable_fuzzy": True,
    "fuzzy_threshold": 0.9,
}


try:  # pragma: no cover - optional dependency handling
    from rapidfuzz import fuzz as _rf_fuzz

    def _similarity(a: str, b: str) -> float:
        return _rf_fuzz.ratio(a, b) / 100.0

except Exception:  # pragma: no cover - optional dependency handling
    try:
        from Levenshtein import ratio as _lev_ratio

        def _similarity(a: str, b: str) -> float:
            return _lev_ratio(a, b)

    except Exception:
        _similarity = None  # type: ignore[assignment]


def _normalise_translation_frame(frame: pd.DataFrame, series_name: str) -> pd.DataFrame:
    """Return a copy of ``frame`` with normalised author/title columns."""

    if frame.empty:
        return pd.DataFrame(columns=[*TRANSLATION_INDEX_COLUMNS, "modern_languages", "translation_years"])

    working = frame.copy()
    working["series_name"] = series_name
    working["latin_author_norm"] = working["latin_author"].fillna("").astype(str).map(normalize_author)
    working["latin_title_norm"] = working["latin_title"].fillna("").astype(str).map(normalize_title)
    working["modern_language"] = working["modern_language"].fillna("").astype(str).str.strip()
    working["translation_year"] = working["year_of_translation"].fillna("").astype(str).str.extract(r"(\d{4})")[0]

    return working[TRANSLATION_INDEX_COLUMNS]


def build_translation_index(frames: Mapping[str, pd.DataFrame]) -> pd.DataFrame:
    """Construct a translation index DataFrame from raw series frames.

    Parameters
    ----------
    frames:
        Mapping of human-readable series labels to DataFrames loaded via
        :func:`latin_corpus.io_utils.load_translation_list`. Each frame should
        contain the columns ``latin_author`` and ``latin_title`` in addition to
        ``modern_language`` and ``year_of_translation``.

    Returns
    -------
    pandas.DataFrame
        Normalised index keyed by ``latin_author_norm`` and ``latin_title_norm``.
        Additional columns store the concatenated translation sources, modern
        languages, and translation years for quick lookups during matching.
    """

    normalised: list[pd.DataFrame] = []
    for series_name, frame in frames.items():
        normalised.append(_normalise_translation_frame(frame, series_name))

    if not normalised:
        return pd.DataFrame(columns=[
            "latin_author_norm",
            "latin_title_norm",
            "translation_sources",
            "modern_languages",
            "translation_years",
        ])

    combined = pd.concat(normalised, ignore_index=True)
    if combined.empty:
        empty = combined.assign(
            translation_sources=pd.Series(dtype=str),
            modern_languages=pd.Series(dtype=str),
            translation_years=pd.Series(dtype=str),
        )
        return empty[
            [
                "latin_author_norm",
                "latin_title_norm",
                "translation_sources",
                "modern_languages",
                "translation_years",
            ]
        ]
    grouped = combined.groupby(["latin_author_norm", "latin_title_norm"], dropna=False)

    def _collapse(values: Iterable[str]) -> str:
        cleaned = []
        for value in values:
            if pd.isna(value):
                continue
            text = str(value).strip()
            if not text or text.lower() in {"na", "nan", "none"}:
                continue
            cleaned.append(text)
        unique = sorted(set(cleaned))
        return ";".join(unique)

    aggregated = grouped.agg(
        translation_sources=("series_name", _collapse),
        modern_languages=("modern_language", _collapse),
        translation_years=("translation_year", _collapse),
    ).reset_index()

    return aggregated


def _prepare_author_lookup(index: pd.DataFrame) -> Mapping[str, pd.DataFrame]:
    lookup: MutableMapping[str, pd.DataFrame] = {}
    if index.empty:
        return lookup

    for author, frame in index.groupby("latin_author_norm"):
        lookup[str(author)] = frame
    return lookup


def add_translation_flags(
    master_df: pd.DataFrame,
    translation_index: pd.DataFrame,
    *,
    config: Optional[Mapping[str, object]] = None,
) -> pd.DataFrame:
    """Annotate ``master_df`` with translation availability information.

    Parameters
    ----------
    master_df:
        Bibliographic DataFrame produced by :func:`build_master_bibliography`.
        Must contain ``author_norm`` and ``title_norm`` columns.
    translation_index:
        Output of :func:`build_translation_index` with normalised keys and
        aggregated translation metadata.
    config:
        Optional configuration mapping overriding values in
        :data:`DEFAULT_MATCH_CONFIG`. Supported keys are ``enable_fuzzy`` (bool)
        and ``fuzzy_threshold`` (float).

    Returns
    -------
    pandas.DataFrame
        Copy of ``master_df`` enriched with the boolean field
        ``has_modern_translation`` and supporting metadata columns
        (``translation_sources``, ``translation_languages``,
        ``translation_years``).
    """

    if master_df.empty:
        result = master_df.copy()
        result["has_modern_translation"] = False
        result["translation_sources"] = ""
        result["translation_languages"] = ""
        result["translation_years"] = ""
        return result

    working = master_df.copy()

    merged = working.merge(
        translation_index,
        how="left",
        left_on=["author_norm", "title_norm"],
        right_on=["latin_author_norm", "latin_title_norm"],
    )

    merged["has_modern_translation"] = merged["translation_sources"].fillna("").astype(str).str.len() > 0
    merged["translation_sources"] = merged["translation_sources"].fillna("").astype(str)
    merged["translation_languages"] = merged["modern_languages"].fillna("").astype(str)
    merged["translation_years"] = merged["translation_years"].fillna("").astype(str)

    needs_fuzzy = ~merged["has_modern_translation"]
    if needs_fuzzy.any():
        merged = _apply_fuzzy_matches(merged, translation_index, needs_fuzzy, config)

    merged = merged.drop(columns=["latin_author_norm", "latin_title_norm", "modern_languages"], errors="ignore")

    return merged


def _apply_fuzzy_matches(
    merged: pd.DataFrame,
    translation_index: pd.DataFrame,
    mask: pd.Series,
    config: Optional[Mapping[str, object]],
) -> pd.DataFrame:
    options: MutableMapping[str, object] = dict(DEFAULT_MATCH_CONFIG)
    if config:
        options.update(config)

    if not options.get("enable_fuzzy", True):
        return merged

    if _similarity is None:
        LOGGER.warning("Fuzzy matching requested but no similarity backend is available.")
        return merged

    threshold = float(options.get("fuzzy_threshold", 0.9))

    lookup = _prepare_author_lookup(translation_index)
    for idx in merged.index[mask]:
        author = str(merged.at[idx, "author_norm"])
        title = str(merged.at[idx, "title_norm"])
        candidates = lookup.get(author)
        if candidates is None or candidates.empty:
            continue

        best_score = 0.0
        best_row: Optional[pd.Series] = None
        for _, candidate in candidates.iterrows():
            score = _similarity(title, str(candidate["latin_title_norm"]))
            if score > best_score:
                best_score = score
                best_row = candidate

        if best_row is not None and best_score >= threshold:
            merged.at[idx, "has_modern_translation"] = True
            merged.at[idx, "translation_sources"] = best_row.get("translation_sources", "")
            merged.at[idx, "translation_languages"] = best_row.get("modern_languages", "")
            merged.at[idx, "translation_years"] = best_row.get("translation_years", "")

    return merged


__all__ = [
    "DEFAULT_MATCH_CONFIG",
    "build_translation_index",
    "add_translation_flags",
]
