"""Catalogue normalisation and merging utilities."""

from __future__ import annotations

import hashlib
import logging
from dataclasses import dataclass
from typing import Callable, Dict, Iterable, Mapping, Optional

from ._compat import require_pandas

pd = require_pandas()

from .io_utils import DEFAULT_FILENAMES, load_ustc, load_vd
from .normalize import extract_year, normalize_author, normalize_title, standardize_language_label

LOGGER = logging.getLogger(__name__)

CatalogLoader = Callable[..., pd.DataFrame]


@dataclass
class CatalogSpec:
    """Configuration for a source catalogue."""

    loader: CatalogLoader
    column_map: Mapping[str, str]
    default_filename: str
    extra_kwargs: Mapping[str, object] | None = None


# Default column mappings are deliberately conservative and should be adjusted to
# match the exported CSV headers used in your environment.
CATALOG_SPECS: Dict[str, CatalogSpec] = {
    "USTC": CatalogSpec(
        loader=load_ustc,
        column_map={
            "ustc_id": "source_id",
            "author": "author",
            "short_title": "title",
            "full_title": "full_title",
            "imprint_place": "imprint_place",
            "imprint_year": "imprint_year",
            "language": "language",
            "subjects": "subjects",
            "digital_facsimile_urls": "digital_facsimile_urls",
        },
        default_filename=DEFAULT_FILENAMES["USTC"],
    ),
    "VD16": CatalogSpec(
        loader=load_vd,
        column_map={
            "vd16": "source_id",
            "author": "author",
            "title_short": "title",
            "title_full": "full_title",
            "place": "imprint_place",
            "year": "imprint_year",
            "language": "language",
            "keywords": "subjects",
            "digital_urls": "digital_facsimile_urls",
        },
        default_filename=DEFAULT_FILENAMES["VD16"],
        extra_kwargs={"catalog_name": "VD16"},
    ),
    "VD17": CatalogSpec(
        loader=load_vd,
        column_map={
            "vd17": "source_id",
            "author": "author",
            "short_title": "title",
            "full_title": "full_title",
            "place": "imprint_place",
            "imprint_year": "imprint_year",
            "language": "language",
            "subjects": "subjects",
            "digital_facsimile": "digital_facsimile_urls",
        },
        default_filename=DEFAULT_FILENAMES["VD17"],
        extra_kwargs={"catalog_name": "VD17"},
    ),
    "VD18": CatalogSpec(
        loader=load_vd,
        column_map={
            "vd18": "source_id",
            "author": "author",
            "title": "title",
            "title_full": "full_title",
            "place": "imprint_place",
            "year": "imprint_year",
            "language": "language",
            "subjects": "subjects",
            "digital_facsimile": "digital_facsimile_urls",
        },
        default_filename=DEFAULT_FILENAMES["VD18"],
        extra_kwargs={"catalog_name": "VD18"},
    ),
}

CATALOG_PRIORITY: tuple[str, ...] = ("USTC", "VD16", "VD17", "VD18", "ESTC")

VALUE_COLUMNS: tuple[str, ...] = (
    "author",
    "title",
    "full_title",
    "imprint_place",
    "subjects",
    "digital_facsimile_urls",
)


def _load_catalogue(name: str, overrides: Optional[Mapping[str, object]] = None) -> pd.DataFrame:
    """Load and lightly clean a single catalogue."""

    spec = CATALOG_SPECS.get(name)
    if spec is None:
        LOGGER.warning("No catalog specification for %s; skipping", name)
        return pd.DataFrame()

    kwargs = dict(spec.extra_kwargs or {})
    if overrides:
        kwargs.update(overrides)

    frame = spec.loader(path=kwargs.pop("path", None), column_map=spec.column_map, **kwargs)
    if frame.empty:
        return frame

    frame["source_catalog"] = name

    for col in ("author", "title", "full_title", "imprint_place", "subjects", "digital_facsimile_urls"):
        if col in frame.columns:
            frame[col] = frame[col].fillna("").astype(str).str.strip()
        else:
            frame[col] = ""

    frame["author_norm"] = frame["author"].apply(normalize_author)
    frame["title_norm"] = frame["title"].apply(normalize_title)
    frame["imprint_year"] = frame["imprint_year"].apply(extract_year)

    frame["language_standardized"] = frame["language"].apply(standardize_language_label)
    lang_text = frame["language"].fillna("").astype(str)
    mask = frame["language_standardized"].eq("Latin") | lang_text.str.contains("latin", case=False)
    frame = frame[mask]
    frame["language"] = frame["language_standardized"].fillna(frame["language"])

    frame["has_digital_facsimile"] = frame["digital_facsimile_urls"].apply(lambda value: bool(str(value).strip()))
    frame["digital_facsimile_sources"] = frame["has_digital_facsimile"].map({True: name, False: ""})

    return frame[
        [
            "source_catalog",
            "source_id",
            "author",
            "author_norm",
            "title",
            "title_norm",
            "full_title",
            "imprint_place",
            "imprint_year",
            "language",
            "subjects",
            "digital_facsimile_urls",
            "has_digital_facsimile",
            "digital_facsimile_sources",
        ]
    ]


def _combine_source_ids(values: Iterable[str]) -> str:
    unique = sorted({v for v in values if v})
    return ";".join(unique)


def _combine_strings(values: Iterable[str]) -> str:
    unique = sorted({v.strip() for v in values if v and v.strip()})
    return ";".join(unique)


def _generate_work_id(author_norm: str, title_norm: str, imprint_year: Optional[int]) -> str:
    year_token = str(imprint_year) if imprint_year is not None else "na"
    digest = hashlib.md5(f"{author_norm}||{title_norm}||{year_token}".encode("utf-8")).hexdigest()
    return f"wrk_{digest[:12]}"


def _deduplicate(master: pd.DataFrame) -> pd.DataFrame:
    if master.empty:
        return master

    rank_map = {name: idx for idx, name in enumerate(CATALOG_PRIORITY)}
    master = master.copy()
    master["catalog_rank"] = master["source_catalog"].map(rank_map).fillna(len(rank_map)).astype(int)
    master["data_completeness"] = master[list(VALUE_COLUMNS)].notna().sum(axis=1)
    master["imprint_year_group"] = master["imprint_year"].fillna(-1).astype(int)
    master["dedupe_key"] = list(zip(master["author_norm"], master["title_norm"], master["imprint_year_group"]))

    master_sorted = master.sort_values(by=["catalog_rank", "data_completeness"], ascending=[True, False])
    best = master_sorted.drop_duplicates(subset="dedupe_key", keep="first")

    source_id_map = master.groupby("dedupe_key")["source_id"].apply(_combine_source_ids)
    digital_url_map = master.groupby("dedupe_key")["digital_facsimile_urls"].apply(_combine_strings)
    digital_sources_map = master.groupby("dedupe_key")["digital_facsimile_sources"].apply(_combine_strings)
    has_digital_map = master.groupby("dedupe_key")["has_digital_facsimile"].any()

    best = best.copy()
    best["source_id"] = best["dedupe_key"].map(source_id_map)
    best["digital_facsimile_urls"] = best["dedupe_key"].map(digital_url_map).fillna("")
    best["digital_facsimile_sources"] = best["dedupe_key"].map(digital_sources_map).fillna("")
    best["has_digital_facsimile"] = best["dedupe_key"].map(has_digital_map).fillna(False)

    best["work_id"] = best.apply(
        lambda row: _generate_work_id(row["author_norm"], row["title_norm"], row["imprint_year"]), axis=1
    )

    best = best.drop(columns=["catalog_rank", "data_completeness", "imprint_year_group", "dedupe_key"])
    best["imprint_year"] = best["imprint_year"].astype("Int64")

    columns = [
        "work_id",
        "source_catalog",
        "source_id",
        "author",
        "author_norm",
        "title",
        "title_norm",
        "full_title",
        "imprint_place",
        "imprint_year",
        "language",
        "subjects",
        "digital_facsimile_urls",
        "has_digital_facsimile",
        "digital_facsimile_sources",
    ]

    return best[columns]


def build_master_bibliography(overrides: Optional[Mapping[str, Mapping[str, object]]] = None) -> pd.DataFrame:
    """Construct a unified DataFrame across all configured catalogues.

    Parameters
    ----------
    overrides:
        Optional mapping keyed by catalogue name that supplies keyword arguments
        for the respective loader (e.g. ``{"USTC": {"path": "ustc_subset.csv"}}``).

    Returns
    -------
    pandas.DataFrame
        Normalised and de-duplicated catalogue entries limited to Latin-language
        records. The result includes generated ``work_id`` values and flags for
        known digital facsimiles.
    """

    frames = []
    for name in CATALOG_SPECS:
        frame = _load_catalogue(name, overrides=overrides.get(name) if overrides else None)
        if frame.empty:
            LOGGER.info("Catalogue %s produced no records (missing file or no Latin entries)", name)
            continue
        frames.append(frame)

    if not frames:
        LOGGER.warning("No catalogue data available; returning empty DataFrame")
        return pd.DataFrame(
            columns=[
                "work_id",
                "source_catalog",
                "source_id",
                "author",
                "author_norm",
                "title",
                "title_norm",
                "full_title",
                "imprint_place",
                "imprint_year",
                "language",
                "subjects",
                "digital_facsimile_urls",
                "has_digital_facsimile",
                "digital_facsimile_sources",
            ]
        )

    combined = pd.concat(frames, ignore_index=True)
    master = _deduplicate(combined)
    LOGGER.info("Master bibliography contains %s rows", len(master))
    return master


__all__ = [
    "CATALOG_PRIORITY",
    "CATALOG_SPECS",
    "build_master_bibliography",
]
