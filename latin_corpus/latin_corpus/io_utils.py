"""Input/output utilities for catalogue and translation data.

This module centralises reading and writing logic so that the rest of the
pipeline can rely on consistent DataFrame schemas. All file interactions are
confined to the ``latin_corpus/data`` directory tree by default, but custom
paths may be supplied when integrating additional catalogues.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Iterable, Mapping, MutableMapping, Optional

from ._compat import require_pandas

pd = require_pandas()

LOGGER = logging.getLogger(__name__)

PACKAGE_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = PACKAGE_ROOT / "data" / "raw"
PROCESSED_DATA_DIR = PACKAGE_ROOT / "data" / "processed"

# Default file names act as placeholders that users can replace with their own
# exports. The files do not need to exist; missing files yield empty frames so
# that the rest of the pipeline can still run for testing purposes.
DEFAULT_FILENAMES: Mapping[str, str] = {
    "USTC": "ustc_export.csv",
    "VD16": "vd16_export.csv",
    "VD17": "vd17_export.csv",
    "VD18": "vd18_export.csv",
    "ESTC": "estc_export.csv",
}

# Columns that are commonly requested downstream. Missing columns are filled
# with ``pd.NA`` so that DataFrame operations remain well defined.
CORE_CATALOG_COLUMNS: tuple[str, ...] = (
    "source_id",
    "author",
    "title",
    "full_title",
    "imprint_place",
    "imprint_year",
    "language",
    "subjects",
    "digital_facsimile_urls",
)

TRANSLATION_COLUMNS: tuple[str, ...] = (
    "latin_author",
    "latin_title",
    "modern_language",
    "translation_series",
    "year_of_translation",
)

DEFAULT_READ_KWARGS: Mapping[str, object] = {
    "dtype": str,
    "keep_default_na": False,
    "na_values": ["", "NA", "N/A", "null", "None"],
}


def _resolve_path(path: Optional[Path | str], default_name: str) -> Path:
    """Return the resolved path to a raw data file.

    Parameters
    ----------
    path:
        Custom path provided by the caller. May be absolute or relative.
    default_name:
        File name (without directory) to use when ``path`` is ``None``.

    Returns
    -------
    Path
        Fully resolved file path. The file does not need to exist yet.
    """

    if path is None:
        candidate = RAW_DATA_DIR / default_name
    else:
        candidate = Path(path)
        if not candidate.is_absolute():
            candidate = RAW_DATA_DIR / candidate
    return candidate


def _ensure_columns(frame: pd.DataFrame, required: Iterable[str]) -> pd.DataFrame:
    """Guarantee that ``frame`` has the specified ``required`` columns."""

    missing = [col for col in required if col not in frame.columns]
    if missing:
        frame = frame.assign(**{col: pd.NA for col in missing})
    return frame


def _load_csv(path: Path, *, column_map: Optional[Mapping[str, str]] = None, **kwargs) -> pd.DataFrame:
    """Load a CSV/TSV file into a DataFrame with optional column renaming.

    If the file does not exist, an empty DataFrame with mapped columns is
    returned instead of raising an exception. This behaviour allows the
    pipeline to run in environments where only a subset of catalogues are
    available.
    """

    read_kwargs: MutableMapping[str, object] = dict(DEFAULT_READ_KWARGS)
    read_kwargs.update(kwargs)

    if path.suffix.lower() == ".tsv":
        read_kwargs.setdefault("sep", "\t")

    if not path.exists():
        LOGGER.warning("File not found: %s", path)
        frame = pd.DataFrame()
    else:
        frame = pd.read_csv(path, **read_kwargs)
        LOGGER.info("Loaded %s with %s rows and %s columns", path, len(frame), len(frame.columns))

    if column_map:
        frame = frame.rename(columns=column_map)

    return frame


def load_ustc(path: Optional[Path | str] = None, *, column_map: Optional[Mapping[str, str]] = None, **kwargs) -> pd.DataFrame:
    """Load a Universal Short Title Catalogue (USTC) export.

    Parameters
    ----------
    path:
        Optional custom path. Defaults to ``data/raw/ustc_export.csv``.
    column_map:
        Mapping from source column names to canonical names. Columns listed in
        :data:`CORE_CATALOG_COLUMNS` should be covered.
    **kwargs:
        Additional arguments forwarded to :func:`pandas.read_csv`.

    Returns
    -------
    pandas.DataFrame
        DataFrame with at least the columns defined in
        :data:`CORE_CATALOG_COLUMNS`. Missing fields are populated with ``pd.NA``.
    """

    resolved = _resolve_path(path, DEFAULT_FILENAMES["USTC"])
    frame = _load_csv(resolved, column_map=column_map, **kwargs)
    frame = _ensure_columns(frame, CORE_CATALOG_COLUMNS)
    return frame


def load_vd(path: Optional[Path | str] = None, *, catalog_name: str, column_map: Optional[Mapping[str, str]] = None, **kwargs) -> pd.DataFrame:
    """Load a VD catalogue (VD16/VD17/VD18) export.

    Parameters
    ----------
    path:
        Optional custom file path relative to ``data/raw``. If omitted, a
        placeholder derived from ``catalog_name`` is used (e.g. ``vd16_export.csv``).
    catalog_name:
        Name of the catalogue, used to construct default file names and
        populate metadata fields downstream.
    column_map:
        Optional rename mapping, analogous to :func:`load_ustc`.
    **kwargs:
        Additional keyword arguments for :func:`pandas.read_csv`.
    """

    default_name = DEFAULT_FILENAMES.get(catalog_name.upper(), f"{catalog_name.lower()}_export.csv")
    resolved = _resolve_path(path, default_name)
    frame = _load_csv(resolved, column_map=column_map, **kwargs)
    frame = _ensure_columns(frame, CORE_CATALOG_COLUMNS)
    return frame


def load_translation_list(path: Optional[Path | str] = None, *, series_name: str, column_map: Optional[Mapping[str, str]] = None, **kwargs) -> pd.DataFrame:
    """Load a CSV containing information about modern translations.

    Parameters
    ----------
    path:
        Optional custom path relative to ``data/raw``. If omitted, the file name
        defaults to ``{series_name}.csv`` in snake case (e.g. ``loeb_classical_library.csv``).
    series_name:
        Label describing the translation series (e.g. "Loeb"). This value is not
        used during loading but is convenient when building indices downstream.
    column_map:
        Optional rename mapping for column normalisation.
    **kwargs:
        Additional keyword arguments for :func:`pandas.read_csv`.
    """

    default_name = f"{series_name.lower().replace(' ', '_')}.csv"
    resolved = _resolve_path(path, default_name)
    frame = _load_csv(resolved, column_map=column_map, **kwargs)
    frame = _ensure_columns(frame, TRANSLATION_COLUMNS)
    return frame


def save_processed(df: pd.DataFrame, filename: str, *, index: bool = False, **kwargs) -> Path:
    """Write ``df`` to ``data/processed`` with ``filename``.

    Parameters
    ----------
    df:
        DataFrame to be persisted.
    filename:
        File name (with extension) relative to ``data/processed``.
    index:
        Whether to include the DataFrame index. Defaults to ``False``.
    **kwargs:
        Additional arguments forwarded to :meth:`pandas.DataFrame.to_csv`.

    Returns
    -------
    Path
        The path of the saved file, allowing the caller to log or reuse it.
    """

    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = PROCESSED_DATA_DIR / filename
    df.to_csv(path, index=index, **kwargs)
    LOGGER.info("Saved processed data to %s", path)
    return path


__all__ = [
    "DEFAULT_FILENAMES",
    "RAW_DATA_DIR",
    "PROCESSED_DATA_DIR",
    "load_translation_list",
    "load_ustc",
    "load_vd",
    "save_processed",
]
