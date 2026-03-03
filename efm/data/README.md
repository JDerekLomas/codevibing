# Untranslated Latin Works Dataset

This directory contains resources prepared for a Latin translation pipeline.

## Files

- `untranslated_latin_texts.csv` — canonical dataset of 100 Latin works without signaled English translations. Suitable for spreadsheet processing or ingestion into project management tools.
- `untranslated_latin_texts.json` — JSON serialization of the same records for programmatic use.

## Column Reference (`CSV`)

| Column | Description |
| --- | --- |
| `identifier` | Archive.org identifier for the work. |
| `title` | Title as provided by the archive metadata. |
| `creator` | Author or compiler when available. |
| `year` | Publication year, if present. |
| `subjects` | Subject keywords supplied by the archive. |
| `description` | Short description or abstract. |
| `language` | Reported language metadata (all items limited to Latin). |
| `item_url` | Landing page for the item on archive.org. |
| `preferred_format` | Format selected as the best starting point for translation work. |
| `download_url` | Direct download link for the preferred format. |
| `text_available` | Quick signal whether machine-readable text is likely available. |
| `translation_status` | Placeholder workflow status (`not-started` by default). |
| `notes` | Free-form field for translators or project managers. |

## Generation Script

Run `python3 scripts/build_untranslated_latin_db.py` to refresh the dataset. The script keeps pulling archive.org metadata until it accumulates 100 qualifying Latin-only works and rewrites both output files.

## Suggested Workflow

1. Import `untranslated_latin_texts.csv` into your translation tracker (Notion, Airtable, Google Sheets, etc.).
2. Assign translators and update `translation_status` / `notes` as you progress.
3. When new works are needed, rerun the build script; it will pull the latest matches from archive.org and regenerate the CSV/JSON files.

