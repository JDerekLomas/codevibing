"""
ESTC (English Short Title Catalogue) data source.
"""
from typing import List, Dict
from .base import CatalogueBase, CatalogueRecord


class ESTC(CatalogueBase):
    """ESTC catalogue implementation."""
    
    def __init__(self, data_source: str = None):
        super().__init__("ESTC")
        self.data_source = data_source
    
    def fetch_records(self, **kwargs) -> List[CatalogueRecord]:
        """
        Fetch Latin records from ESTC (1450-1900).
        ESTC covers English-language works, but includes Latin works published in England.
        """
        # TODO: Implement actual data fetching
        records = []
        return records
    
    def normalize_record(self, raw_record: Dict) -> CatalogueRecord:
        """Convert ESTC raw record to CatalogueRecord."""
        record = CatalogueRecord(
            title=raw_record.get("title", ""),
            author=raw_record.get("author", ""),
            year=self._parse_year(raw_record.get("publication_date", "")),
            place=raw_record.get("place_of_publication", ""),
            publisher=raw_record.get("publisher", ""),
            catalogue_id=str(raw_record.get("estc_id", "")),
            catalogue_name="ESTC",
            language=raw_record.get("language", "Latin"),
            format=raw_record.get("format", ""),
            pages=self._parse_pages(raw_record.get("pages", "")),
            digital_facsimile_url=raw_record.get("digital_url", ""),
            digital_facsimile_source=raw_record.get("digital_source", ""),
            raw_data=raw_record
        )
        
        record.normalized_title = self.normalize_title(record.title)
        record.normalized_author = self.normalize_author(record.author)
        record.imprint = self._build_imprint(record.place, record.publisher, record.year)
        
        return record
    
    def _parse_year(self, year_str: str) -> int:
        """Parse year from string."""
        try:
            if isinstance(year_str, int):
                return year_str if 1450 <= year_str <= 1900 else None
            # ESTC dates might be in various formats
            import re
            year_match = re.search(r'\b(1[4-9]\d{2})\b', str(year_str))
            if year_match:
                year = int(year_match.group(1))
                return year if 1450 <= year <= 1900 else None
            return None
        except (ValueError, TypeError):
            return None
    
    def _parse_pages(self, pages_str: str) -> int:
        """Parse page count from string."""
        try:
            if isinstance(pages_str, int):
                return pages_str
            import re
            match = re.search(r'\d+', str(pages_str))
            return int(match.group()) if match else None
        except (ValueError, TypeError):
            return None
    
    def _build_imprint(self, place: str, publisher: str, year: int) -> str:
        """Build imprint string."""
        parts = []
        if place:
            parts.append(place)
        if publisher:
            parts.append(publisher)
        if year:
            parts.append(str(year))
        return ", ".join(parts) if parts else ""


