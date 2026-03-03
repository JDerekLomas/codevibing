"""
Utility functions for loading catalogue data from CSV files.
"""
import csv
from typing import List, Dict, Optional
from pathlib import Path
from .base import CatalogueBase, CatalogueRecord


def load_csv_records(
    csv_path: Path,
    field_mapping: Dict[str, str],
    language_filter: Optional[str] = "Latin",
    year_min: int = 1450,
    year_max: int = 1900
) -> List[Dict]:
    """
    Load and filter records from a CSV file.
    
    Args:
        csv_path: Path to CSV file
        field_mapping: Dictionary mapping CSV column names to standard field names
                      e.g., {"Title": "title", "Author": "author"}
        language_filter: Language to filter for (None to skip filtering)
        year_min: Minimum year (inclusive)
        year_max: Maximum year (inclusive)
    
    Returns:
        List of dictionaries with standardized field names
    """
    records = []
    
    if not Path(csv_path).exists():
        return records
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Map fields
            mapped = {}
            for csv_col, std_field in field_mapping.items():
                mapped[std_field] = row.get(csv_col, "").strip()
            
            # Filter by language if specified
            if language_filter:
                lang = mapped.get("language", "").lower()
                if lang and lang not in ["latin", "la", ""]:
                    continue
            
            # Filter by year if available
            year_str = mapped.get("year", "")
            if year_str:
                try:
                    year = int(str(year_str).strip()[:4])
                    if not (year_min <= year <= year_max):
                        continue
                except (ValueError, TypeError):
                    pass
            
            # Keep original row for reference
            mapped["_raw_row"] = row
            records.append(mapped)
    
    return records


# Example field mappings for common catalogues
FIELD_MAPPINGS = {
    "USTC": {
        "title": "title",
        "author": "author",
        "year": "year",
        "place_of_publication": "place",
        "publisher": "publisher",
        "ustc_id": "catalogue_id",
        "language": "language",
        "format": "format",
        "pages": "pages",
        "digital_url": "digital_facsimile_url",
        "digital_source": "digital_facsimile_source"
    },
    "VD16": {
        "title": "title",
        "author": "author",
        "year": "year",
        "place": "place",
        "printer": "publisher",
        "vd16_id": "catalogue_id",
        "language": "language",
        "format": "format",
        "pages": "pages",
        "digital_url": "digital_facsimile_url",
        "digital_source": "digital_facsimile_source"
    },
    "VD17": {
        "title": "title",
        "author": "author",
        "year": "year",
        "place": "place",
        "printer": "publisher",
        "vd17_id": "catalogue_id",
        "language": "language",
        "format": "format",
        "pages": "pages",
        "digital_url": "digital_facsimile_url",
        "digital_source": "digital_facsimile_source"
    },
    "VD18": {
        "title": "title",
        "author": "author",
        "year": "year",
        "place": "place",
        "printer": "publisher",
        "vd18_id": "catalogue_id",
        "language": "language",
        "format": "format",
        "pages": "pages",
        "digital_url": "digital_facsimile_url",
        "digital_source": "digital_facsimile_source"
    },
    "ESTC": {
        "title": "title",
        "author": "author",
        "publication_date": "year",
        "place_of_publication": "place",
        "publisher": "publisher",
        "estc_id": "catalogue_id",
        "language": "language",
        "format": "format",
        "pages": "pages",
        "digital_url": "digital_facsimile_url",
        "digital_source": "digital_facsimile_source"
    }
}


