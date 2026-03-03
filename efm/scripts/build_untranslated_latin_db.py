#!/usr/bin/env python3
"""
Build a dataset of Latin-language works from the Internet Archive.

The script queries the archive.org advancedsearch API for historical Latin texts,
filters out entries that advertise other languages or translations, enriches each
item with download metadata, and writes the resulting dataset to CSV and JSON
files under the data/ directory.
"""

from __future__ import annotations

import csv
import json
import sys
import time
from dataclasses import dataclass, asdict
from typing import Dict, Iterable, List, Optional, Sequence, Tuple

import requests

ADVANCED_SEARCH_URL = "https://archive.org/advancedsearch.php"
METADATA_URL_TEMPLATE = "https://archive.org/metadata/{identifier}"

OUTPUT_CSV = "data/untranslated_latin_texts.csv"
OUTPUT_JSON = "data/untranslated_latin_texts.json"

QUERY = "language:(Latin) AND mediatype:(texts) AND year:[1500 TO 1950]"
FIELDS = [
    "identifier",
    "title",
    "creator",
    "language",
    "year",
    "description",
    "subject",
]
SORT = ["year asc", "publicdate asc"]
ROWS_PER_PAGE = 500
TARGET_COUNT = 100

BLOCKLIST_TERMS = {
    "english",
    "translation",
    "translated",
    "traduction",
    "traduzione",
    "spanish",
    "german",
    "french",
    "italian",
    "parallel text",
    "bilingual",
    "facing page",
}

PREFERRED_FORMATS = (
    ("Plain Text", lambda f: (f.get("format") or "").lower() in {"text", "txt", "plain text", "utf-8 text", "text file"}),
    ("UTF-8 Text", lambda f: "utf-8" in (f.get("format") or "").lower()),
    ("HTML", lambda f: (f.get("name") or "").lower().endswith(".html")),
    ("EPUB", lambda f: (f.get("name") or "").lower().endswith(".epub")),
    ("PDF", lambda f: (f.get("name") or "").lower().endswith(".pdf")),
    ("DjVu TXT", lambda f: "djvu txt" in (f.get("format") or "").lower()),
    ("Abbyy GZ", lambda f: (f.get("name") or "").lower().endswith(".abbyy.gz")),
)


@dataclass
class WorkRecord:
    identifier: str
    title: str
    creator: str
    year: str
    subjects: str
    description: str
    language: str
    item_url: str
    preferred_format: str
    download_url: str
    text_available: str
    translation_status: str = "not-started"
    notes: str = ""

    def to_csv_row(self) -> List[str]:
        return [
            self.identifier,
            self.title,
            self.creator,
            self.year,
            self.subjects,
            self.description,
            self.language,
            self.item_url,
            self.preferred_format,
            self.download_url,
            self.text_available,
            self.translation_status,
            self.notes,
        ]


def parse_language_field(value) -> List[str]:
    if value is None:
        return []
    if isinstance(value, list):
        raw_values: Iterable[str] = value
    else:
        raw_values = [value]
    tokens: List[str] = []
    for raw in raw_values:
        if not raw:
            continue
        for part in str(raw).replace(";", ",").split(","):
            cleaned = part.strip().lower()
            if cleaned:
                tokens.append(cleaned)
    return tokens


def languages_are_exclusively_latin(languages: Sequence[str]) -> bool:
    if not languages:
        return False
    latin_like = {"latin", "lat", "la"}
    normalized = []
    for lang in languages:
        if "latin" in lang:
            normalized.append("latin")
        else:
            normalized.append(lang)
    return all(lang in latin_like for lang in normalized)


def has_blocklisted_terms(doc: Dict) -> bool:
    text_blobs: List[str] = []
    for key in ("title", "description", "subject"):
        value = doc.get(key)
        if isinstance(value, list):
            text_blobs.extend([str(v).lower() for v in value if v])
        elif value:
            text_blobs.append(str(value).lower())
    combined = " | ".join(text_blobs)
    return any(term in combined for term in BLOCKLIST_TERMS)


def fetch_search_page(page: int) -> Dict:
    params = {
        "q": QUERY,
        "fl[]": FIELDS,
        "sort[]": SORT,
        "rows": ROWS_PER_PAGE,
        "page": page,
        "output": "json",
    }
    attempts = 0
    backoff = 2.0
    while True:
        try:
            response = requests.get(ADVANCED_SEARCH_URL, params=params, timeout=45)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as exc:
            attempts += 1
            if attempts >= 3:
                raise
            sleep_for = backoff * attempts
            print(f"Retrying search page {page} after error: {exc}", file=sys.stderr)
            time.sleep(sleep_for)


def pick_preferred_file(identifier: str) -> Tuple[str, str, str]:
    """Return (format_label, download_url, text_available flag)."""
    try:
        response = requests.get(
            METADATA_URL_TEMPLATE.format(identifier=identifier), timeout=45
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        print(f"Warning: metadata lookup failed for {identifier}: {exc}", file=sys.stderr)
        return "", "", "unknown"

    payload = response.json()
    files = payload.get("files", [])
    if not isinstance(files, list):
        return "", "", "unknown"

    for label, predicate in PREFERRED_FORMATS:
        for file_entry in files:
            try:
                if predicate(file_entry):
                    name = file_entry.get("name")
                    if not name:
                        continue
                    download_url = f"https://archive.org/download/{identifier}/{name}"
                    text_available = "yes" if "text" in label.lower() else "likely"
                    return label, download_url, text_available
            except Exception:
                continue

    # Fallback: return first file if available.
    if files:
        first = files[0]
        name = first.get("name")
        if name:
            download_url = f"https://archive.org/download/{identifier}/{name}"
            return first.get("format", ""), download_url, "unknown"

    return "", "", "unknown"


def normalize_field(value) -> str:
    if not value:
        return ""
    if isinstance(value, list):
        cleaned = [str(v).strip() for v in value if v]
        return "; ".join(cleaned)
    return str(value).strip()


def build_dataset() -> List[WorkRecord]:
    records: List[WorkRecord] = []
    page = 1
    total_available = None

    while len(records) < TARGET_COUNT:
        data = fetch_search_page(page)
        response = data.get("response", {})
        docs = response.get("docs", [])
        if total_available is None:
            total_available = response.get("numFound")
            print(f"Total candidates reported by API: {total_available}")

        if not docs:
            print("No more documents returned; stopping.", file=sys.stderr)
            break

        print(f"Processing page {page} (received {len(docs)} docs)...")

        for doc in docs:
            languages = parse_language_field(doc.get("language"))
            if not languages_are_exclusively_latin(languages):
                continue
            if has_blocklisted_terms(doc):
                continue

            identifier = doc.get("identifier")
            title = normalize_field(doc.get("title"))
            if not identifier or not title:
                continue

            preferred_format, download_url, text_available = pick_preferred_file(identifier)

            record = WorkRecord(
                identifier=identifier,
                title=title,
                creator=normalize_field(doc.get("creator")),
                year=normalize_field(doc.get("year")),
                subjects=normalize_field(doc.get("subject")),
                description=normalize_field(doc.get("description")),
                language=", ".join(sorted(set(parse_language_field(doc.get("language"))))),
                item_url=f"https://archive.org/details/{identifier}",
                preferred_format=preferred_format,
                download_url=download_url,
                text_available=text_available,
            )

            records.append(record)
            print(f"Added {identifier}; total collected: {len(records)}")
            if len(records) >= TARGET_COUNT:
                break

            # Be gentle to the API.
            time.sleep(0.1)

        page += 1
        time.sleep(1.0)

    return records[:TARGET_COUNT]


def write_csv(records: Sequence[WorkRecord]) -> None:
    header = [
        "identifier",
        "title",
        "creator",
        "year",
        "subjects",
        "description",
        "language",
        "item_url",
        "preferred_format",
        "download_url",
        "text_available",
        "translation_status",
        "notes",
    ]
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        for record in records:
            writer.writerow(record.to_csv_row())
    print(f"Wrote {len(records)} records to {OUTPUT_CSV}")


def write_json(records: Sequence[WorkRecord]) -> None:
    with open(OUTPUT_JSON, "w", encoding="utf-8") as jsonfile:
        json.dump([asdict(record) for record in records], jsonfile, ensure_ascii=False, indent=2)
    print(f"Wrote {len(records)} records to {OUTPUT_JSON}")


def main() -> int:
    records = build_dataset()
    if len(records) < TARGET_COUNT:
        print(
            f"Warning: only collected {len(records)} records (target {TARGET_COUNT}).",
            file=sys.stderr,
        )
    write_csv(records)
    write_json(records)
    return 0


if __name__ == "__main__":
    sys.exit(main())
