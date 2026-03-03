"""
Main processing pipeline for creating the master bibliography.
"""
import csv
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from .catalogues import (
    CatalogueBase, CatalogueRecord,
    USTC, VD16, VD17, VD18, ESTC
)
from .deduplication import RecordMatcher, MatchedGroup


class BibliographyProcessor:
    """Main processor for creating the master bibliography."""
    
    def __init__(
        self,
        catalogues: List[CatalogueBase],
        output_dir: Path = Path("data/processed"),
        matcher: Optional[RecordMatcher] = None
    ):
        """
        Initialize processor.
        
        Args:
            catalogues: List of catalogue instances to process
            output_dir: Directory for output files
            matcher: Optional custom matcher (uses default if None)
        """
        self.catalogues = catalogues
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.matcher = matcher or RecordMatcher()
    
    def process(self) -> str:
        """
        Main processing pipeline:
        1. Fetch records from all catalogues
        2. Filter for Latin works (1450-1900)
        3. Deduplicate records
        4. Generate master bibliography CSV
        
        Returns:
            Path to output CSV file
        """
        print("Starting bibliography processing...")
        
        # Step 1: Fetch all records
        print("Fetching records from catalogues...")
        all_records = []
        for catalogue in self.catalogues:
            print(f"  Processing {catalogue.name}...")
            try:
                records = catalogue.fetch_records()
                # Filter for Latin and date range
                filtered = self._filter_records(records)
                print(f"    Found {len(filtered)} Latin records (1450-1900)")
                all_records.extend(filtered)
            except Exception as e:
                print(f"    Error processing {catalogue.name}: {e}")
                continue
        
        print(f"\nTotal records collected: {len(all_records)}")
        
        # Step 2: Deduplicate
        print("\nDeduplicating records...")
        matched_groups = self.matcher.match_records(all_records)
        print(f"Created {len(matched_groups)} deduplicated work groups")
        
        # Step 3: Generate CSV
        print("\nGenerating master bibliography CSV...")
        output_path = self.output_dir / "latin_master_bibliography.csv"
        self._write_csv(matched_groups, output_path)
        
        print(f"\n✓ Master bibliography saved to: {output_path}")
        print(f"  Total works: {len(matched_groups)}")
        
        return str(output_path)
    
    def _filter_records(self, records: List[CatalogueRecord]) -> List[CatalogueRecord]:
        """Filter records for Latin works in date range 1450-1900."""
        filtered = []
        for record in records:
            # Check language (default is Latin, but verify if specified)
            if record.language and record.language.lower() not in ["latin", "la", ""]:
                continue
            
            # Check date range
            if record.year:
                if not (1450 <= record.year <= 1900):
                    continue
            
            filtered.append(record)
        
        return filtered
    
    def _write_csv(self, groups: List[MatchedGroup], output_path: Path):
        """Write matched groups to CSV file."""
        fieldnames = [
            "work_id",
            "title",
            "author",
            "year",
            "place",
            "publisher",
            "attesting_catalogues",
            "catalogue_ids",
            "digital_facsimile_urls",
            "digital_facsimile_sources",
            "record_count"
        ]
        
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            
            for group in groups:
                # Get best values from group
                title = group.get_best_title()
                author = group.get_best_author() or ""
                year = group.get_year()
                
                # Get place/publisher from first record with these fields
                place = ""
                publisher = ""
                for record in group.records:
                    if record.place:
                        place = record.place
                    if record.publisher:
                        publisher = record.publisher
                    if place and publisher:
                        break
                
                # Attesting catalogues
                catalogues = sorted(group.get_attesting_catalogues())
                attesting_catalogues = "; ".join(catalogues)
                
                # Catalogue IDs (format: CATALOGUE:ID)
                catalogue_ids = []
                for record in group.records:
                    if record.catalogue_id:
                        catalogue_ids.append(f"{record.catalogue_name}:{record.catalogue_id}")
                catalogue_ids_str = "; ".join(catalogue_ids)
                
                # Digital facsimiles
                facsimiles = group.get_digital_facsimiles()
                facsimile_urls = "; ".join([f["url"] for f in facsimiles])
                facsimile_sources = "; ".join([f["source"] for f in facsimiles])
                
                writer.writerow({
                    "work_id": group.group_id,
                    "title": title,
                    "author": author,
                    "year": year or "",
                    "place": place,
                    "publisher": publisher,
                    "attesting_catalogues": attesting_catalogues,
                    "catalogue_ids": catalogue_ids_str,
                    "digital_facsimile_urls": facsimile_urls,
                    "digital_facsimile_sources": facsimile_sources,
                    "record_count": len(group.records)
                })


def create_processor_from_config(
    config_path: Optional[Path] = None,
    output_dir: Path = Path("data/processed")
) -> BibliographyProcessor:
    """
    Create processor from configuration file.
    If no config provided, creates processor with all catalogues (no data sources).
    """
    catalogues = []
    matcher = None
    
    if config_path and Path(config_path).exists():
        # Load from config file
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Create catalogues
        for cat_config in config.get("catalogues", []):
            cat_name = cat_config.get("name", "").upper()
            data_source = cat_config.get("data_source")
            
            if cat_name == "USTC":
                catalogues.append(USTC(data_source))
            elif cat_name == "VD16":
                catalogues.append(VD16(data_source))
            elif cat_name == "VD17":
                catalogues.append(VD17(data_source))
            elif cat_name == "VD18":
                catalogues.append(VD18(data_source))
            elif cat_name == "ESTC":
                catalogues.append(ESTC(data_source))
        
        # Create matcher with config if provided
        matching_config = config.get("matching", {})
        if matching_config:
            matcher = RecordMatcher(
                title_similarity_threshold=matching_config.get("title_similarity_threshold", 0.85),
                author_similarity_threshold=matching_config.get("author_similarity_threshold", 0.80),
                year_tolerance=matching_config.get("year_tolerance", 2)
            )
    else:
        # Default: create all catalogues without data sources
        # User will need to configure data sources
        catalogues = [
            USTC(),
            VD16(),
            VD17(),
            VD18(),
            ESTC()
        ]
    
    return BibliographyProcessor(catalogues, output_dir=output_dir, matcher=matcher)

