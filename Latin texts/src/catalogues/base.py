"""
Base class for catalogue data sources.
Each catalogue (USTC, VD16/17/18, ESTC) should implement this interface.
"""
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class CatalogueRecord:
    """Standardized record structure for a Latin work/edition."""
    # Core identification
    title: str
    author: Optional[str] = None
    year: Optional[int] = None
    place: Optional[str] = None
    publisher: Optional[str] = None
    
    # Catalogue-specific identifiers
    catalogue_id: str = ""  # ID in the source catalogue
    catalogue_name: str = ""  # e.g., "USTC", "VD16", "ESTC"
    
    # Additional metadata
    language: str = "Latin"  # Default to Latin, but allow verification
    format: Optional[str] = None  # e.g., "folio", "quarto", "octavo"
    pages: Optional[int] = None
    
    # Digital facsimile information
    digital_facsimile_url: Optional[str] = None
    digital_facsimile_source: Optional[str] = None  # e.g., "EEBO", "Gallica", "Google Books"
    
    # Additional fields for matching/deduplication
    normalized_title: Optional[str] = None
    normalized_author: Optional[str] = None
    imprint: Optional[str] = None  # Combined place, publisher, year
    
    # Raw data from source (for debugging/reference)
    raw_data: Dict = field(default_factory=dict)


class CatalogueBase(ABC):
    """Base class for all catalogue data sources."""
    
    def __init__(self, name: str):
        self.name = name
    
    @abstractmethod
    def fetch_records(self, **kwargs) -> List[CatalogueRecord]:
        """
        Fetch records from this catalogue.
        Should filter for Latin works (1450-1900) and return CatalogueRecord objects.
        """
        pass
    
    @abstractmethod
    def normalize_record(self, raw_record: Dict) -> CatalogueRecord:
        """
        Convert a raw record from this catalogue into a CatalogueRecord.
        """
        pass
    
    def normalize_title(self, title: str) -> str:
        """Normalize title for matching (lowercase, remove punctuation, etc.)."""
        if not title:
            return ""
        # Basic normalization: lowercase, remove extra whitespace
        normalized = title.lower().strip()
        # Remove common punctuation that varies
        normalized = normalized.replace(",", "").replace(".", "").replace(";", "")
        normalized = " ".join(normalized.split())  # Normalize whitespace
        return normalized
    
    def normalize_author(self, author: str) -> str:
        """Normalize author name for matching."""
        if not author:
            return ""
        normalized = author.lower().strip()
        # Remove common prefixes/suffixes
        normalized = normalized.replace(",", "").replace(".", "")
        normalized = " ".join(normalized.split())
        return normalized


