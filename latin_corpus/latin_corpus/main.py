"""Command-line entry point for building the Latin master dataset."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Iterable, Mapping, MutableMapping, TYPE_CHECKING

from ._compat import MissingDependencyError

if TYPE_CHECKING:  # pragma: no cover - import for typing only
    import pandas as pd


LOGGER = logging.getLogger(__name__)

MASTER_OUTPUT_FILENAME = "latin_master_1450_1900.csv"

# Default translation series specifications. Adjust or extend this tuple to suit
# the catalogues available in ``data/raw``.
TRANSLATION_SERIES: tuple[Mapping[str, object], ...] = (
    {"label": "Loeb", "path": "loeb_classical_library.csv"},
    {"label": "I Tatti", "path": "i_tatti_renaissance_library.csv"},
    {"label": "Brill", "path": "brill_translations.csv"},
)


def _load_translation_frames(series_specs: Iterable[Mapping[str, object]]) -> Mapping[str, "pd.DataFrame"]:
    frames: MutableMapping[str, "pd.DataFrame"] = {}
    for spec in series_specs:
        label = str(spec.get("label", "")).strip()
        if not label:
            LOGGER.warning("Skipping translation series with missing label: %s", spec)
            continue
        path = spec.get("path")
        column_map = spec.get("column_map")
        read_kwargs = spec.get("read_kwargs", {})
        from .io_utils import load_translation_list

        frames[label] = load_translation_list(path=path, series_name=label, column_map=column_map, **read_kwargs)
    return frames


def _print_summary(df: "pd.DataFrame", output_path: Path) -> None:
    total_rows = len(df)
    LOGGER.info("Saved master table to %s", output_path)
    LOGGER.info("Total rows: %s", total_rows)

    if total_rows == 0:
        LOGGER.warning("No data rows available. Check catalogue inputs in data/raw/.")
        return

    facsimile_series = df["has_digital_facsimile"].fillna(False).astype(bool)
    translation_series = df["has_modern_translation"].fillna(False).astype(bool)

    percent_unscanned = 100.0 * (1.0 - facsimile_series.mean())
    percent_untranslated = 100.0 * (1.0 - translation_series.mean())

    LOGGER.info("%% without digital facsimile: %.2f", percent_unscanned)
    LOGGER.info("%% without modern translation: %.2f", percent_untranslated)

    top_priority = df.sort_values("priority_score", ascending=False).head(20)
    if top_priority.empty:
        LOGGER.info("No rows with positive priority scores yet.")
        return

    display_columns = [
        "work_id",
        "author",
        "title",
        "imprint_year",
        "has_digital_facsimile",
        "has_modern_translation",
        "priority_score",
        "priority_tags",
    ]
    LOGGER.info("Top 20 priority works:\n%s", top_priority[display_columns].to_string(index=False))


def run_pipeline() -> "pd.DataFrame":
    """Execute the full pipeline and return the enriched master DataFrame."""

    from .io_utils import save_processed
    from .merge import build_master_bibliography
    from .priority import add_priority_scores
    from .translation_match import DEFAULT_MATCH_CONFIG, add_translation_flags, build_translation_index

    master = build_master_bibliography()
    translation_frames = _load_translation_frames(TRANSLATION_SERIES)
    translation_index = build_translation_index(translation_frames)
    with_translations = add_translation_flags(master, translation_index, config=DEFAULT_MATCH_CONFIG)
    scored = add_priority_scores(with_translations)
    output_path = save_processed(scored, MASTER_OUTPUT_FILENAME)
    _print_summary(scored, output_path)
    return scored


def main() -> None:
    """Entry point used by ``python -m latin_corpus.main``."""

    logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s:%(message)s")
    try:
        run_pipeline()
    except MissingDependencyError as exc:
        LOGGER.error("%s", exc)
        raise SystemExit(1) from exc


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    main()
