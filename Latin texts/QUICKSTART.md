# Quick Start Guide

## Overview

This system creates a deduplicated master bibliography of Latin printed works (1450-1900) from multiple catalogues.

## Setup

1. **Install Python 3.7+** (if not already installed)

2. **Install dependencies** (currently uses only standard library):
   ```bash
   # No external dependencies required initially
   # Add packages to requirements.txt as needed for your data sources
   ```

3. **Prepare your data files**:
   - Place CSV files in `data/raw/`
   - Ensure CSV files have columns for: title, author, year, language, etc.
   - See `src/catalogues/csv_loader.py` for expected field mappings

## Basic Usage

### Step 1: Configure Data Sources

Create a `config.json` file (or copy `config.example.json`):

```json
{
  "catalogues": [
    {
      "name": "USTC",
      "data_source": "data/raw/ustc_latin.csv"
    },
    {
      "name": "VD16",
      "data_source": "data/raw/vd16_latin.csv"
    }
  ]
}
```

### Step 2: Run the Processor

```bash
python main.py --config config.json
```

Or without config (uses all catalogues with default settings):

```bash
python main.py
```

### Step 3: Check Output

The master bibliography will be created at:
```
data/processed/latin_master_bibliography.csv
```

## CSV File Format

Your CSV files should include these columns (adjust field mappings in catalogue classes if needed):

- `title` - Work title
- `author` - Author name
- `year` - Publication year (1450-1900)
- `language` - Language code (should be "Latin" or "la")
- `place_of_publication` or `place` - Publication place
- `publisher` or `printer` - Publisher/printer name
- `[catalogue]_id` - Unique ID in the catalogue (e.g., `ustc_id`, `vd16_id`)
- `digital_url` - URL to digital facsimile (optional)
- `digital_source` - Source of digital facsimile (optional)

## Customizing Field Mappings

If your CSV columns don't match the default names, update the `fetch_records()` method in the relevant catalogue class (e.g., `src/catalogues/ustc.py`):

```python
csv_mapping = {
    "Your CSV Column": "standard_field",
    "Title": "title",
    "Author": "author",
    # ... etc
}
```

## Matching Configuration

Adjust matching thresholds in `config.json`:

```json
{
  "matching": {
    "title_similarity_threshold": 0.85,
    "author_similarity_threshold": 0.80,
    "year_tolerance": 2
  }
}
```

- Lower thresholds = more matches (more false positives)
- Higher thresholds = fewer matches (more false negatives)
- `year_tolerance`: Maximum year difference for matching (default: 2)

## Output Format

The output CSV (`latin_master_bibliography.csv`) contains:

- **work_id**: Unique identifier for each deduplicated work
- **title**: Best available title
- **author**: Author name
- **year**: Publication year
- **place**: Place of publication
- **publisher**: Publisher/printer
- **attesting_catalogues**: Which catalogues include this work (e.g., "USTC; VD16")
- **catalogue_ids**: Catalogue-specific IDs (e.g., "USTC:12345; VD16:67890")
- **digital_facsimile_urls**: URLs to digital facsimiles
- **digital_facsimile_sources**: Sources of facsimiles
- **record_count**: Number of records merged into this entry

## Troubleshooting

### No records found
- Check that CSV files exist and paths are correct
- Verify CSV files contain Latin works (language = "Latin" or "la")
- Check that years are in range 1450-1900
- Review field mappings match your CSV column names

### Too many/few matches
- Adjust similarity thresholds in config.json
- Review matching logic in `src/deduplication/matcher.py`

### Import errors
- Ensure you're running from the project root directory
- Check Python version (3.7+)

## Next Steps

- Add more catalogues by creating new classes in `src/catalogues/`
- Integrate API access for catalogues that provide it
- Enhance matching algorithms for better deduplication
- Add translation detection and handling


