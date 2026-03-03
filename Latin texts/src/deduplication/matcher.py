"""
Deduplication and matching logic for identifying the same work across catalogues.
"""
from typing import List, Dict, Set, Tuple
from dataclasses import dataclass, field
from collections import defaultdict
from ..catalogues.base import CatalogueRecord


@dataclass
class MatchedGroup:
    """A group of records that represent the same work/edition."""
    records: List[CatalogueRecord] = field(default_factory=list)
    group_id: str = ""
    
    def get_attesting_catalogues(self) -> Set[str]:
        """Return set of catalogue names that attest this work."""
        return {record.catalogue_name for record in self.records}
    
    def get_best_title(self) -> str:
        """Get the most complete title from the group."""
        if not self.records:
            return ""
        # Prefer longest non-empty title
        titles = [r.title for r in self.records if r.title]
        return max(titles, key=len) if titles else ""
    
    def get_best_author(self) -> str:
        """Get the most complete author from the group."""
        if not self.records:
            return None
        authors = [r.author for r in self.records if r.author]
        return max(authors, key=len) if authors else None
    
    def get_year(self) -> int:
        """Get year (prefer non-None, otherwise any)."""
        years = [r.year for r in self.records if r.year]
        return years[0] if years else None
    
    def get_digital_facsimiles(self) -> List[Dict[str, str]]:
        """Get all digital facsimile URLs and sources."""
        facsimiles = []
        seen_urls = set()
        for record in self.records:
            if record.digital_facsimile_url and record.digital_facsimile_url not in seen_urls:
                facsimiles.append({
                    "url": record.digital_facsimile_url,
                    "source": record.digital_facsimile_source or "Unknown"
                })
                seen_urls.add(record.digital_facsimile_url)
        return facsimiles


class RecordMatcher:
    """
    Matches records across catalogues to identify the same work/edition.
    Uses multiple matching strategies with configurable thresholds.
    """
    
    def __init__(
        self,
        title_similarity_threshold: float = 0.85,
        author_similarity_threshold: float = 0.80,
        year_tolerance: int = 2
    ):
        """
        Initialize matcher with similarity thresholds.
        
        Args:
            title_similarity_threshold: Minimum similarity for title matching (0-1)
            author_similarity_threshold: Minimum similarity for author matching (0-1)
            year_tolerance: Maximum year difference for matching
        """
        self.title_threshold = title_similarity_threshold
        self.author_threshold = author_similarity_threshold
        self.year_tolerance = year_tolerance
    
    def match_records(self, records: List[CatalogueRecord]) -> List[MatchedGroup]:
        """
        Group records that represent the same work/edition.
        
        Returns list of MatchedGroup objects, each containing related records.
        """
        if not records:
            return []
        
        # Build similarity graph
        groups = []
        remaining = set(range(len(records)))
        
        while remaining:
            # Start new group with first remaining record
            seed_idx = min(remaining)
            group_indices = {seed_idx}
            remaining.remove(seed_idx)
            
            # Find all records that match this group
            changed = True
            while changed:
                changed = False
                to_add = []
                
                for idx in remaining:
                    if self._matches_group(records[idx], [records[i] for i in group_indices]):
                        to_add.append(idx)
                        changed = True
                
                for idx in to_add:
                    group_indices.add(idx)
                    remaining.remove(idx)
            
            # Create matched group
            group_records = [records[i] for i in group_indices]
            group = MatchedGroup(
                records=group_records,
                group_id=f"GROUP_{len(groups):06d}"
            )
            groups.append(group)
        
        return groups
    
    def _matches_group(self, record: CatalogueRecord, group_records: List[CatalogueRecord]) -> bool:
        """Check if a record matches any record in a group."""
        for group_record in group_records:
            if self._records_match(record, group_record):
                return True
        return False
    
    def _records_match(self, r1: CatalogueRecord, r2: CatalogueRecord) -> bool:
        """
        Determine if two records represent the same work/edition.
        Uses multiple matching criteria.
        """
        # Exact same catalogue and ID = same record (shouldn't happen, but check)
        if r1.catalogue_name == r2.catalogue_name and r1.catalogue_id == r2.catalogue_id:
            return True
        
        # Must have titles to match
        if not r1.normalized_title or not r2.normalized_title:
            return False
        
        # Title similarity check
        title_sim = self._string_similarity(r1.normalized_title, r2.normalized_title)
        if title_sim < self.title_threshold:
            return False
        
        # Author check (if both have authors)
        if r1.normalized_author and r2.normalized_author:
            author_sim = self._string_similarity(r1.normalized_author, r2.normalized_author)
            if author_sim < self.author_threshold:
                return False
        
        # Year check (if both have years)
        if r1.year and r2.year:
            year_diff = abs(r1.year - r2.year)
            if year_diff > self.year_tolerance:
                return False
        
        # If we get here, records likely match
        return True
    
    def _string_similarity(self, s1: str, s2: str) -> float:
        """
        Calculate similarity between two strings (0-1).
        Uses a combination of exact match, token overlap, and edit distance.
        """
        if not s1 or not s2:
            return 0.0
        
        # Exact match
        if s1 == s2:
            return 1.0
        
        # Token-based similarity (Jaccard)
        tokens1 = set(s1.split())
        tokens2 = set(s2.split())
        if not tokens1 or not tokens2:
            return 0.0
        
        intersection = len(tokens1 & tokens2)
        union = len(tokens1 | tokens2)
        jaccard = intersection / union if union > 0 else 0.0
        
        # Simple edit distance (Levenshtein-like, normalized)
        # For efficiency, use a simpler approach
        max_len = max(len(s1), len(s2))
        if max_len == 0:
            return 0.0
        
        # Use token overlap as primary metric, with length penalty
        length_penalty = min(len(s1), len(s2)) / max_len
        
        # Combine metrics
        similarity = (jaccard * 0.7) + (length_penalty * 0.3)
        
        return similarity


