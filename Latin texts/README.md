# Latin Master Bibliography System

A system for producing a single, deduplicated master list of Latin printed works (1450–1900) from multiple catalogues.

## Overview

This system:
- Aggregates Latin works from multiple catalogues (USTC, VD16/17/18, ESTC)
- Deduplicates records to identify the same work across catalogues
- Tracks which catalogues attest each work
- Records digital facsimile availability
- Outputs a research-grade CSV table

## Output

The system produces `data/processed/latin_master_bibliography.csv` with the following columns:

- `work_id`: Unique identifier for the deduplicated work
- `title`: Best available title
- `author`: Author name (if available)
- `year`: Publication year
- `place`: Place of publication
- `publisher`: Publisher/printer
- `attesting_catalogues`: Semicolon-separated list of catalogues that include this work
- `catalogue_ids`: Semicolon-separated list of catalogue-specific IDs (format: `CATALOGUE:ID`)
- `digital_facsimile_urls`: URLs to digital facsimiles (if available)
- `digital_facsimile_sources`: Sources of digital facsimiles (e.g., "EEBO", "Gallica")
- `record_count`: Number of records merged into this work entry

## Project Structure

```
.
├── data/
│   ├── raw/           # Raw catalogue data files (if using file-based sources)
│   └── processed/     # Output files (CSV)
├── src/
│   ├── catalogues/    # Catalogue data source modules
│   │   ├── base.py    # Base classes and record structure
│   │   ├── ustc.py    # USTC implementation
│   │   ├── vd16.py    # VD16 implementation
│   │   ├── vd17.py    # VD17 implementation
│   │   ├── vd18.py    # VD18 implementation
│   │   └── estc.py    # ESTC implementation
│   ├── deduplication/ # Matching and deduplication logic
│   │   └── matcher.py # Record matching algorithm
│   └── processor.py   # Main processing pipeline
├── main.py            # Entry point script
├── requirements.txt   # Python dependencies
└── README.md          # This file
```

## Usage

### Basic Usage

```bash
python main.py
```

### With Configuration File

Create a `config.json` file:

```json
{
  "catalogues": [
    {
      "name": "USTC",
      "data_source": "path/to/ustc/data.csv"
    },
    {
      "name": "VD16",
      "data_source": "path/to/vd16/data.csv"
    }
  ]
}
```

Then run:

```bash
python main.py --config config.json
```

## Catalogue Integration

Each catalogue module (`ustc.py`, `vd16.py`, etc.) needs to implement data fetching. The current implementation provides the structure but requires you to:

1. **Configure data sources**: Update the `fetch_records()` method in each catalogue class to:
   - Load from CSV/JSON files
   - Connect to APIs
   - Query databases
   - Or use any other data access method

2. **Map fields**: Ensure the `normalize_record()` method correctly maps your data format to the `CatalogueRecord` structure.

### Example: Loading from CSV

```python
def fetch_records(self, **kwargs) -> List[CatalogueRecord]:
    import csv
    records = []
    with open(self.data_source, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Filter for Latin works
            if row.get('language', '').lower() in ['latin', 'la', '']:
                record = self.normalize_record(row)
                records.append(record)
    return records
```

## Deduplication

The system uses a multi-criteria matching algorithm:

- **Title similarity**: Normalized title comparison (threshold: 0.85)
- **Author matching**: Author name comparison (threshold: 0.80)
- **Year proximity**: Year difference tolerance (default: 2 years)

Records are grouped if they match on title (with similarity threshold) and, when available, author and year.

## Data Requirements

Input data should include:
- Title (required for matching)
- Author (recommended)
- Year (recommended, 1450-1900)
- Language (should be "Latin" or equivalent)
- Catalogue-specific ID
- Digital facsimile information (optional)

## Future Enhancements

- Translation detection and handling
- Priority scoring for catalogue sources
- Enhanced matching algorithms (fuzzy matching, machine learning)
- Additional catalogue integrations
- Web interface for browsing/searching
- Export to other formats (JSON, XML, MARC)

## License

[Specify license]

## Contributing

[Contributing guidelines]


