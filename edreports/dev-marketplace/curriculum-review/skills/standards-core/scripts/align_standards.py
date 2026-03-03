#!/usr/bin/env python3
"""
align_standards.py

Standards alignment engine for mapping K-12 textbook content to CCSS/state standards.
Produces coverage matrices, evidence logs, and page indices.

Usage:
  python align_standards.py --extract-pages <pdf> --out <dir>
  python align_standards.py --pages <pages.jsonl> --standards <pack.yaml> --subject math --grades 3 --out <dir>
"""

import argparse
import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
import yaml
from collections import defaultdict

# Optional: install pdfplumber for better PDF parsing
try:
    import pdfplumber
    HAS_PDFPLUMBER = True
except ImportError:
    HAS_PDFPLUMBER = False
    print("Warning: pdfplumber not installed. PDF extraction may be limited.", file=sys.stderr)


class StandardsAligner:
    """Main class for aligning textbook content to standards."""

    def __init__(self, standards_yaml: str, subject: str, grades: str):
        """Initialize with a standards pack YAML."""
        self.standards = self._load_standards(standards_yaml)
        self.subject = subject
        self.grades = self._parse_grades(grades)
        self.coverage = defaultdict(lambda: {
            "taught": False,
            "practiced": False,
            "assessed": False,
            "intensity": "none",
            "off_grade_percent": 0,
            "redundancy_count": 0,
            "evidence_found": False,
            "top_pages": [],
        })

    def _load_standards(self, yaml_path: str) -> List[Dict[str, Any]]:
        """Load standards from YAML file."""
        with open(yaml_path, 'r') as f:
            data = yaml.safe_load(f)
        return data.get('standards', [])

    def _parse_grades(self, grades_str: str) -> List[int]:
        """Parse grades string like '3-5' or '3,4,5' into list."""
        if '-' in grades_str:
            start, end = map(int, grades_str.split('-'))
            return list(range(start, end + 1))
        else:
            return [int(g.strip()) for g in grades_str.split(',')]

    def extract_pages(self, pdf_path: str, out_dir: str) -> None:
        """Extract and index pages from a PDF textbook."""
        if not HAS_PDFPLUMBER:
            print(f"Error: pdfplumber required for PDF extraction. Install with: pip install pdfplumber", file=sys.stderr)
            sys.exit(1)

        out_file = Path(out_dir) / "pages.jsonl"
        book_id = Path(pdf_path).stem

        with pdfplumber.open(pdf_path) as pdf:
            with open(out_file, 'w') as f:
                for page_num, page in enumerate(pdf.pages, start=1):
                    text = page.extract_text() or ""
                    tables = page.extract_tables() or []

                    page_data = {
                        "book_id": book_id,
                        "page": page_num,
                        "text": text,
                        "has_tables": len(tables) > 0,
                        "table_count": len(tables)
                    }
                    f.write(json.dumps(page_data) + "\n")

        print(f"Extracted {pdf.pages.__len__()} pages from {pdf_path} -> {out_file}")

    def align_pages(self, pages_jsonl: str, out_dir: str) -> Dict[str, Any]:
        """Align textbook pages to standards using keyword matching."""
        evidence = defaultdict(list)
        pages_data = {}

        # Load pages
        with open(pages_jsonl, 'r') as f:
            for line in f:
                page_obj = json.loads(line.strip())
                pages_data[f"{page_obj['book_id']}:{page_obj['page']}"] = page_obj

        # For each standard, search pages
        for standard in self.standards:
            if standard['grade'] not in self.grades:
                continue

            std_id = standard['id']
            keywords = standard.get('keywords', [])
            anti_keywords = standard.get('anti_keywords', [])
            hits = []

            for page_key, page_data in pages_data.items():
                text_lower = page_data['text'].lower()

                # Count keyword matches
                keyword_matches = sum(text_lower.count(kw.lower()) for kw in keywords)
                anti_matches = sum(text_lower.count(akw.lower()) for akw in anti_keywords)

                if keyword_matches > 0 and anti_matches == 0:
                    hits.append({
                        "page_key": page_key,
                        "page_num": page_data['page'],
                        "book_id": page_data['book_id'],
                        "keyword_matches": keyword_matches,
                        "text_snippet": page_data['text'][:200],  # First 200 chars
                    })

            if hits:
                hits.sort(key=lambda x: x['keyword_matches'], reverse=True)
                evidence[std_id] = hits[:3]  # Keep top 3

                # Determine coverage flags
                coverage_entry = self.coverage[std_id]
                coverage_entry["taught"] = True
                coverage_entry["practiced"] = any("exercise" in h['text_snippet'].lower() for h in hits)
                coverage_entry["assessed"] = any("assess" in h['text_snippet'].lower() for h in hits)
                coverage_entry["intensity"] = "high" if len(hits) > 1 else "medium"
                coverage_entry["evidence_found"] = True
                coverage_entry["top_pages"] = [h['page_num'] for h in hits[:3]]
                coverage_entry["redundancy_count"] = len(hits)

        # Mark uncovered standards
        for standard in self.standards:
            if standard['grade'] in self.grades and standard['id'] not in evidence:
                self.coverage[standard['id']]["evidence_found"] = False

        return dict(evidence)

    def write_outputs(self, evidence: Dict[str, List[Dict]], out_dir: str) -> None:
        """Write coverage.json and evidence.jsonl outputs."""
        os.makedirs(out_dir, exist_ok=True)

        # Write coverage.json
        coverage_data = {
            "metadata": {
                "subject": self.subject,
                "grades": f"{min(self.grades)}-{max(self.grades)}" if self.grades else "unknown",
                "total_standards": len(self.standards)
            },
            "standards": [
                {
                    "id": std['id'],
                    "grade": std['grade'],
                    **self.coverage[std['id']]
                }
                for std in self.standards if std['grade'] in self.grades
            ],
            "summary": {
                "total_covered": sum(1 for c in self.coverage.values() if c['evidence_found']),
                "total_uncovered": sum(1 for c in self.coverage.values() if not c['evidence_found']),
            }
        }
        coverage_data["summary"]["coverage_percent"] = (
            int(100 * coverage_data["summary"]["total_covered"] / len(self.standards))
            if self.standards else 0
        )

        with open(Path(out_dir) / "coverage.json", 'w') as f:
            json.dump(coverage_data, f, indent=2)

        # Write evidence.jsonl
        with open(Path(out_dir) / "evidence.jsonl", 'w') as f:
            for std_id, hits in evidence.items():
                entry = {
                    "standard": std_id,
                    "pages": [h['page_num'] for h in hits] if hits else [],
                }
                if hits:
                    entry["top_hit"] = {
                        "page": hits[0]['page_num'],
                        "book_id": hits[0]['book_id'],
                        "quote": hits[0]['text_snippet'],
                        "anchor": f"{hits[0]['book_id']}:{hits[0]['page_num']}:0:100",
                        "context": "Textbook content"
                    }
                else:
                    entry["unrated"] = "evidence not found"

                f.write(json.dumps(entry) + "\n")

        print(f"Outputs written to {out_dir}/")


def main():
    parser = argparse.ArgumentParser(description="Standards alignment engine for K-12 textbooks")
    parser.add_argument("--extract-pages", help="Extract pages from PDF")
    parser.add_argument("--pages", help="Path to pages.jsonl input")
    parser.add_argument("--standards", help="Path to standards pack YAML")
    parser.add_argument("--subject", choices=["math", "ela"], default="math")
    parser.add_argument("--grades", default="3-5", help="Grade range (e.g., '3-5' or '3,4,5')")
    parser.add_argument("--out", default="outputs", help="Output directory")

    args = parser.parse_args()

    # Mode 1: Extract pages
    if args.extract_pages:
        os.makedirs(args.out, exist_ok=True)
        aligner = StandardsAligner(args.standards or "standards/ccss_math_grade3_sample.yaml", args.subject, args.grades)
        aligner.extract_pages(args.extract_pages, args.out)

    # Mode 2: Align standards
    elif args.pages and args.standards:
        aligner = StandardsAligner(args.standards, args.subject, args.grades)
        evidence = aligner.align_pages(args.pages, args.out)
        aligner.write_outputs(evidence, args.out)
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
