import argparse
import csv
import json
import logging
import re
import time
from pathlib import Path
from typing import Dict, List, Optional

import requests

GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
INTERNET_ARCHIVE_API = "https://archive.org/advancedsearch.php"


def normalise_token(value: str) -> str:
    return " ".join(value.lower().strip().split())


def build_cache_key(provider: str, title: str, author: str, *extra: object) -> str:
    tokens: List[str] = [provider, normalise_token(title), normalise_token(author)]
    for value in extra:
        if value is None:
            continue
        tokens.append(normalise_token(str(value)))
    return "|".join(tokens)


def parse_year(raw_value: str) -> Optional[int]:
    if not raw_value:
        return None
    match = re.search(r"(1[0-9]{3}|20[0-9]{2}|[0-9]{3})", raw_value)
    if not match:
        return None
    try:
        return int(match.group(0))
    except ValueError:
        return None


def load_cache(path: Optional[Path]) -> Dict[str, dict]:
    if not path or not path.exists():
        return {}
    try:
        with path.open("r", encoding="utf-8") as handle:
            return json.load(handle)
    except (json.JSONDecodeError, OSError):
        return {}


def save_cache(cache: Dict[str, dict], path: Optional[Path]) -> None:
    if not path:
        return
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("w", encoding="utf-8") as handle:
            json.dump(cache, handle, indent=2, ensure_ascii=True)
    except OSError as err:
        logging.warning("Could not persist cache: %s", err)


def search_google_books(title: str, author: str, session: requests.Session, cache: Dict[str, dict], timeout: float, retries: int) -> dict:
    cache_key = build_cache_key("google", title, author)
    if cache_key in cache:
        return cache[cache_key]

    params = {
        "q": f"intitle:\"{title}\"" + (f"+inauthor:\"{author}\"" if author else ""),
        "maxResults": 10,
        "printType": "books",
    }

    result = {"items": [], "error": None}
    attempt = 0
    while attempt <= retries:
        try:
            response = session.get(GOOGLE_BOOKS_API, params=params, timeout=timeout)
            response.raise_for_status()
            payload = response.json()
            result["items"] = payload.get("items", [])
            break
        except (requests.RequestException, ValueError) as err:
            result["error"] = str(err)
            attempt += 1
            if attempt > retries:
                break
            time.sleep(2 ** attempt)

    cache[cache_key] = result
    return result


def parse_google_books(result: dict) -> Dict[str, List[str]]:
    translation_sources: List[str] = []
    scan_sources: List[str] = []
    for item in result.get("items", []):
        volume_info = item.get("volumeInfo", {})
        access_info = item.get("accessInfo", {})
        language = volume_info.get("language")
        identifiers = volume_info.get("industryIdentifiers", [])
        identifier_tokens = [entry.get("identifier") for entry in identifiers if entry.get("identifier")]
        display_id = item.get("id") or (identifier_tokens[0] if identifier_tokens else None)

        if language and language.lower().startswith("en"):
            token = f"Google Books:{display_id}" if display_id else "Google Books"
            if token not in translation_sources:
                translation_sources.append(token)

        viewability = access_info.get("viewability")
        pdf_available = access_info.get("pdf", {}).get("isAvailable")
        epub_available = access_info.get("epub", {}).get("isAvailable")
        if viewability and viewability.upper() != "NO_PAGES":
            token = f"Google Books:{display_id}" if display_id else "Google Books"
            if token not in scan_sources:
                scan_sources.append(token)
        elif pdf_available or epub_available:
            token = f"Google Books:{display_id}" if display_id else "Google Books"
            if token not in scan_sources:
                scan_sources.append(token)
    return {"translation_sources": translation_sources, "scan_sources": scan_sources}


def search_internet_archive(
    title: str,
    author: str,
    session: requests.Session,
    cache: Dict[str, dict],
    timeout: float,
    retries: int,
    min_year: Optional[int],
    max_year: Optional[int],
) -> dict:
    cache_key = build_cache_key("ia", title, author, min_year, max_year)
    if cache_key in cache:
        return cache[cache_key]

    query_parts = [f'title:("{title}")']
    if author:
        query_parts.append(f'creator:("{author}")')
    if min_year is not None or max_year is not None:
        lower = min_year if min_year is not None else "*"
        upper = max_year if max_year is not None else "*"
        query_parts.append(f"year:[{lower} TO {upper}]")
    query_parts.append("mediatype:(\"texts\")")
    query = " AND ".join(query_parts)

    params = {
        "q": query,
        "rows": 20,
        "output": "json",
        "fl": "identifier,title,creator,language,mediatype,source"
    }

    result = {"response": {"docs": []}, "error": None}
    attempt = 0
    while attempt <= retries:
        try:
            response = session.get(INTERNET_ARCHIVE_API, params=params, timeout=timeout)
            response.raise_for_status()
            payload = response.json()
            result = payload
            break
        except (requests.RequestException, ValueError) as err:
            result["error"] = str(err)
            attempt += 1
            if attempt > retries:
                break
            time.sleep(2 ** attempt)

    cache[cache_key] = result
    return result


def parse_internet_archive(result: dict) -> Dict[str, List[str]]:
    translation_sources: List[str] = []
    scan_sources: List[str] = []
    docs = result.get("response", {}).get("docs", [])
    for doc in docs:
        identifier = doc.get("identifier")
        languages = doc.get("language")
        mediatype = doc.get("mediatype")
        source = doc.get("source")

        if isinstance(languages, list):
            codes = [lang.lower() for lang in languages if isinstance(lang, str)]
        elif isinstance(languages, str):
            codes = [languages.lower()]
        else:
            codes = []

        if any(code.startswith("eng") for code in codes):
            token = f"Internet Archive:{identifier}" if identifier else "Internet Archive"
            if token not in translation_sources:
                translation_sources.append(token)

        if mediatype in {"texts", "image", "audio", "movies"} or source:
            token = f"Internet Archive:{identifier}" if identifier else "Internet Archive"
            if token not in scan_sources:
                scan_sources.append(token)
    return {"translation_sources": translation_sources, "scan_sources": scan_sources}


def process_catalog(
    input_path: Path,
    output_path: Path,
    cache_path: Optional[Path],
    limit: Optional[int],
    sleep_seconds: float,
    timeout: float,
    retries: int,
    dry_run: bool,
    min_year: Optional[int],
    max_year: Optional[int],
) -> None:
    cache = load_cache(cache_path)
    updated_rows: List[dict] = []
    with input_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        fieldnames = reader.fieldnames or []

        def finalise(payload: Dict[str, object]) -> Dict[str, object]:
            translation_sources = sorted(
                {entry for entry in payload.get("translation_sources", []) if entry}
            )
            scan_sources = sorted({entry for entry in payload.get("scan_sources", []) if entry})
            payload["english_translation"] = bool(translation_sources)
            payload["has_scan"] = bool(scan_sources)
            payload["translation_sources"] = ";".join(translation_sources)
            payload["scan_sources"] = ";".join(scan_sources)
            return payload

        with requests.Session() as session:
            session.headers.update({"User-Agent": "BookAvailabilityChecker/1.0"})
            for index, row in enumerate(reader):
                if limit and index >= limit:
                    break
                title = row.get("Title", "")
                author = row.get("Author", "")
                year_value = parse_year(row.get("Year of publication", ""))
                aggregated: Dict[str, object] = {
                    "english_translation": False,
                    "translation_sources": [],
                    "has_scan": False,
                    "scan_sources": [],
                    "google_books_error": None,
                    "internet_archive_error": None,
                    "skipped_by_year_filter": False,
                }

                if not title:
                    updated_rows.append({**row, **finalise(aggregated)})
                    continue

                if (min_year is not None and (year_value is None or year_value < min_year)) or (
                    max_year is not None and (year_value is None or year_value > max_year)
                ):
                    aggregated["skipped_by_year_filter"] = True
                    updated_rows.append({**row, **finalise(aggregated)})
                    continue

                google_result = search_google_books(title, author, session, cache, timeout, retries)
                google_sources = parse_google_books(google_result)
                aggregated["translation_sources"].extend(google_sources["translation_sources"])
                aggregated["scan_sources"].extend(google_sources["scan_sources"])
                if google_result.get("error"):
                    aggregated["google_books_error"] = google_result["error"]

                ia_result = search_internet_archive(
                    title,
                    author,
                    session,
                    cache,
                    timeout,
                    retries,
                    min_year,
                    max_year,
                )
                ia_sources = parse_internet_archive(ia_result)
                aggregated["translation_sources"].extend(ia_sources["translation_sources"])
                aggregated["scan_sources"].extend(ia_sources["scan_sources"])
                if ia_result.get("error"):
                    aggregated["internet_archive_error"] = ia_result["error"]

                updated_rows.append({**row, **finalise(aggregated)})

                if sleep_seconds:
                    time.sleep(sleep_seconds)

    output_fieldnames = list(fieldnames) + [
        "english_translation",
        "translation_sources",
        "has_scan",
        "scan_sources",
        "google_books_error",
        "internet_archive_error",
        "skipped_by_year_filter",
    ]

    if dry_run:
        for sample in updated_rows[:5]:
            logging.info("Sample result: %s", sample)
    else:
        with output_path.open("w", encoding="utf-8", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=output_fieldnames)
            writer.writeheader()
            writer.writerows(updated_rows)

    save_cache(cache, cache_path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Augment a catalog with information about English translations or scans from Google Books and Internet Archive.")
    parser.add_argument("input", type=Path, help="Path to the source CSV catalog")
    parser.add_argument("output", type=Path, help="Where to write the augmented CSV")
    parser.add_argument("--cache", type=Path, default=None, help="Optional path to a JSON cache file")
    parser.add_argument("--limit", type=int, default=None, help="Limit the number of records processed (for testing)")
    parser.add_argument("--sleep", type=float, default=0.0, help="Seconds to sleep between records to respect rate limits")
    parser.add_argument("--timeout", type=float, default=15.0, help="Timeout for each HTTP request in seconds")
    parser.add_argument("--retries", type=int, default=2, help="Number of retries on transient HTTP failures")
    parser.add_argument("--dry-run", action="store_true", help="Run without writing output, log first few results")
    parser.add_argument("--log-level", default="INFO", help="Logging level (DEBUG, INFO, WARNING, ERROR)")
    parser.add_argument("--min-year", type=int, default=None, help="Only process rows with parsed publication year >= this value")
    parser.add_argument("--max-year", type=int, default=None, help="Only process rows with parsed publication year <= this value")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=args.log_level.upper(), format="%(levelname)s %(message)s")

    if not args.input.exists():
        raise FileNotFoundError(f"Input catalog not found: {args.input}")

    process_catalog(
        input_path=args.input,
        output_path=args.output,
        cache_path=args.cache,
        limit=args.limit,
        sleep_seconds=args.sleep,
        timeout=args.timeout,
        retries=args.retries,
        dry_run=args.dry_run,
        min_year=args.min_year,
        max_year=args.max_year,
    )


if __name__ == "__main__":
    main()
