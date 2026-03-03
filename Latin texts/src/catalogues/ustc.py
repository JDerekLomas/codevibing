"""
USTC (Universal Short Title Catalogue) data source.
"""
from pathlib import Path
from typing import List, Dict
from .base import CatalogueBase, CatalogueRecord
from .csv_loader import load_csv_records, FIELD_MAPPINGS


class USTC(CatalogueBase):
    """USTC catalogue implementation."""
    
    def __init__(self, data_source: str = None):
        """
        Initialize USTC catalogue.
        
        Args:
            data_source: Path to USTC data file or API endpoint
        """
        super().__init__("USTC")
        self.data_source = data_source
    
    def fetch_records(self, **kwargs) -> List[CatalogueRecord]:
        """
        Fetch Latin records from USTC (1450-1900).
        
        Supports CSV files. For other data sources (API, database), override this method.
        """
        if not self.data_source:
            return []
        
        data_path = Path(self.data_source)
        if not data_path.exists():
            return []
        
        # Try CSV loading first
        if data_path.suffix.lower() == '.csv':
            # Field mapping: CSV column name -> standard field name
            # Adjust these column names to match your actual CSV file
            csv_mapping = {
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
            }
            
            raw_records = load_csv_records(
                data_path,
                csv_mapping,
                language_filter="Latin",
                year_min=1450,
                year_max=1900
            )
            
            # Convert to CatalogueRecord objects
            records = []
            for raw in raw_records:
                record = self.normalize_record(raw)
                records.append(record)
            
            return records
        
        # TODO: Add support for other formats (JSON, API, database)
        return []
    
    def normalize_record(self, raw_record: Dict) -> CatalogueRecord:
        """Convert USTC raw record to CatalogueRecord."""
        record = CatalogueRecord(
            title=raw_record.get("title", ""),
            author=raw_record.get("author", ""),
            year=self._parse_year(raw_record.get("year", "")),
            place=raw_record.get("place_of_publication", ""),
            publisher=raw_record.get("publisher", ""),
            catalogue_id=str(raw_record.get("ustc_id", "")),
            catalogue_name="USTC",
            language=raw_record.get("language", "Latin"),
            format=raw_record.get("format", ""),
            pages=self._parse_pages(raw_record.get("pages", "")),
            digital_facsimile_url=raw_record.get("digital_url", ""),
            digital_facsimile_source=raw_record.get("digital_source", ""),
            raw_data=raw_record
        )
        
        # Add normalized fields
        record.normalized_title = self.normalize_title(record.title)
        record.normalized_author = self.normalize_author(record.author)
        record.imprint = self._build_imprint(record.place, record.publisher, record.year)
        
        return record
    
    def _parse_year(self, year_str: str) -> int:
        """Parse year from string, return None if invalid."""
        try:
            if isinstance(year_str, int):
                return year_str if 1450 <= year_str <= 1900 else None
            year = int(str(year_str).strip()[:4])  # Take first 4 digits
            return year if 1450 <= year <= 1900 else None
        except (ValueError, TypeError):
            return None
    
    def _parse_pages(self, pages_str: str) -> int:
        """Parse page count from string."""
        try:
            if isinstance(pages_str, int):
                return pages_str
            # Extract first number
            import re
            match = re.search(r'\d+', str(pages_str))
            return int(match.group()) if match else None
        except (ValueError, TypeError):
            return None
    
    def _build_imprint(self, place: str, publisher: str, year: int) -> str:
        """Build imprint string for matching."""
        parts = []
        if place:
            parts.append(place)
        if publisher:
            parts.append(publisher)
        if year:
            parts.append(str(year))
        return ", ".join(parts) if parts else ""

