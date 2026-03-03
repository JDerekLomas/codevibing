"""
VD17 (Verzeichnis der im deutschen Sprachbereich erschienenen Drucke des 17. Jahrhunderts) data source.
"""
from typing import List, Dict
from .base import CatalogueBase, CatalogueRecord


class VD17(CatalogueBase):
    """VD17 catalogue implementation."""
    
    def __init__(self, data_source: str = None):
        super().__init__("VD17")
        self.data_source = data_source
    
    def fetch_records(self, **kwargs) -> List[CatalogueRecord]:
        """
        Fetch Latin records from VD17.
        VD17 covers 1601-1700.
        """
        # TODO: Implement actual data fetching
        records = []
        return records
    
    def normalize_record(self, raw_record: Dict) -> CatalogueRecord:
        """Convert VD17 raw record to CatalogueRecord."""
        record = CatalogueRecord(
            title=raw_record.get("title", ""),
            author=raw_record.get("author", ""),
            year=self._parse_year(raw_record.get("year", "")),
            place=raw_record.get("place", ""),
            publisher=raw_record.get("printer", ""),
            catalogue_id=str(raw_record.get("vd17_id", "")),
            catalogue_name="VD17",
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
                return year_str if 1601 <= year_str <= 1700 else None
            year = int(str(year_str).strip()[:4])
            return year if 1601 <= year <= 1700 else None
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


