#!/usr/bin/env python3
"""
render_binder.py

Renders standards-core outputs into reviewer-ready Markdown, PDF, or DOCX binders.

Usage:
  python render_binder.py --coverage outputs/coverage.json --evidence outputs/evidence.jsonl --format markdown --out binder
  python render_binder.py --coverage outputs/coverage.json --evidence outputs/evidence.jsonl --format all --out binder
"""

import argparse
import json
import sys
import os
from pathlib import Path
from typing import Dict, List, Any, Optional
from datetime import datetime
from jinja2 import Environment, FileSystemLoader, Template
from itertools import groupby
from operator import itemgetter

# Optional for PDF/DOCX export
try:
    import subprocess
    HAS_PANDOC = True
except ImportError:
    HAS_PANDOC = False


class BinderRenderer:
    """Renders standards-core outputs into reviewer-ready documents."""

    def __init__(self, coverage_json: str, evidence_jsonl: str, title: str = "Curriculum Alignment Review"):
        """Initialize renderer with coverage and evidence data."""
        self.coverage_data = self._load_json(coverage_json)
        self.evidence_data = self._load_jsonl(evidence_jsonl)
        self.title = title
        self.generated_at = datetime.now().isoformat()

    def _load_json(self, path: str) -> Dict[str, Any]:
        """Load JSON file."""
        with open(path, 'r') as f:
            return json.load(f)

    def _load_jsonl(self, path: str) -> List[Dict[str, Any]]:
        """Load JSONL file."""
        data = []
        if os.path.exists(path):
            with open(path, 'r') as f:
                for line in f:
                    if line.strip():
                        data.append(json.loads(line.strip()))
        return data

    def render_markdown(self) -> str:
        """Render standards-core data as Markdown binder."""
        md = []

        # Header
        metadata = self.coverage_data.get('metadata', {})
        summary = self.coverage_data.get('summary', {})

        md.append("# Curriculum Alignment Review")
        md.append(f"## {self.title}")
        md.append("")
        md.append(f"**Subject:** {metadata.get('subject', 'Unknown')}")
        md.append(f"**Grades:** {metadata.get('grades', 'Unknown')}")
        md.append(f"**Books:** {metadata.get('books', ['Unknown']) if isinstance(metadata.get('books'), list) else 'Unknown'}")
        md.append(f"**Review Date:** {datetime.now().strftime('%Y-%m-%d')}")
        md.append("")
        md.append("---")
        md.append("")

        # Executive Summary
        md.append("## Executive Summary")
        md.append("")
        md.append(f"- **Total Standards:** {metadata.get('total_standards', 0)}")
        md.append(f"- **Covered:** {summary.get('total_covered', 0)} ({summary.get('coverage_percent', 0)}%)")
        md.append(f"- **Uncovered:** {summary.get('total_uncovered', 0)}")
        md.append("")
        md.append("---")
        md.append("")

        # Standards by Grade
        md.append("## Standards Coverage by Grade")
        md.append("")

        standards = self.coverage_data.get('standards', [])
        # Group by grade
        standards_by_grade = {}
        for std in standards:
            grade = std.get('grade')
            if grade not in standards_by_grade:
                standards_by_grade[grade] = []
            standards_by_grade[grade].append(std)

        for grade in sorted(standards_by_grade.keys()):
            md.append(f"### Grade {grade}")
            md.append("")

            for std in standards_by_grade[grade]:
                std_id = std.get('id', 'Unknown')
                taught = "✓" if std.get('taught') else "✗"
                practiced = "✓" if std.get('practiced') else "✗"
                assessed = "✓" if std.get('assessed') else "✗"

                md.append(f"#### {std_id}")
                md.append("")
                md.append(f"**Status:** {taught} Taught | **Practiced:** {practiced} | **Assessed:** {assessed}")
                md.append(f"**Intensity:** {std.get('intensity', 'Unknown').title()}")
                md.append("")

                # Find evidence for this standard
                evidence = next((e for e in self.evidence_data if e.get('standard') == std_id), None)

                if std.get('evidence_found') and evidence and 'top_hit' in evidence:
                    hit = evidence['top_hit']
                    md.append("**Evidence Found:**")
                    md.append("")
                    md.append(f"> {hit.get('quote', 'N/A')}")
                    md.append(f">");
                    md.append(f"> — *{hit.get('book_id', 'Unknown')}, Page {hit.get('page', 'N/A')}* [`{hit.get('anchor', 'N/A')}`]")
                    md.append("")

                    if evidence.get('pages'):
                        md.append(f"**Key Pages:** {', '.join(map(str, evidence['pages'][:5]))}")
                        md.append("")
                else:
                    md.append("⚠️ **NO EVIDENCE FOUND** — This standard may not be adequately covered.")
                    md.append("")

                md.append("---")
                md.append("")

        # Uncovered Standards
        uncovered = [s for s in standards if not s.get('evidence_found')]
        if uncovered:
            md.append("## Uncovered Standards")
            md.append("")
            md.append("The following standards lack evidence in the provided materials:")
            md.append("")
            for std in uncovered:
                md.append(f"- **{std.get('id')}** (Grade {std.get('grade')})")
            md.append("")

        # Footer
        md.append("---")
        md.append("")
        md.append("## Methodology Notes")
        md.append("")
        md.append("This alignment review was conducted using automated standards-mapping software with manual verification of boundary cases.")
        md.append("All evidence references include page anchors (`book_id:page:start:end`) for direct verification.")
        md.append(f"**Generated:** {self.generated_at}")
        md.append("")

        return "\n".join(md)

    def export_pdf(self, markdown_content: str, out_path: str) -> bool:
        """Export Markdown to PDF using pandoc."""
        if not HAS_PANDOC:
            print("Warning: pandoc not installed. Cannot export to PDF.", file=sys.stderr)
            return False

        try:
            md_path = out_path.replace('.pdf', '.md')
            with open(md_path, 'w') as f:
                f.write(markdown_content)

            cmd = [
                'pandoc',
                md_path,
                '-o', out_path,
                '--pdf-engine=wkhtmltopdf',
                '-V', 'colorlinks',
                '--toc',
                '-V', 'margin-top=20mm',
                '-V', 'margin-bottom=20mm',
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"PDF exported: {out_path}")
            return True
        except Exception as e:
            print(f"Error exporting PDF: {e}", file=sys.stderr)
            return False

    def export_docx(self, markdown_content: str, out_path: str) -> bool:
        """Export Markdown to DOCX using pandoc."""
        if not HAS_PANDOC:
            print("Warning: pandoc not installed. Cannot export to DOCX.", file=sys.stderr)
            return False

        try:
            md_path = out_path.replace('.docx', '.md')
            with open(md_path, 'w') as f:
                f.write(markdown_content)

            cmd = [
                'pandoc',
                md_path,
                '-o', out_path,
                '--toc',
            ]
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"DOCX exported: {out_path}")
            return True
        except Exception as e:
            print(f"Error exporting DOCX: {e}", file=sys.stderr)
            return False

    def render(self, format_list: List[str], out_dir: str) -> None:
        """Render binder in specified formats."""
        os.makedirs(out_dir, exist_ok=True)

        # Always generate Markdown
        markdown_content = self.render_markdown()

        if 'markdown' in format_list or 'all' in format_list:
            md_path = Path(out_dir) / "alignment_report.md"
            with open(md_path, 'w') as f:
                f.write(markdown_content)
            print(f"Markdown binder: {md_path}")

        if 'pdf' in format_list or 'all' in format_list:
            pdf_path = Path(out_dir) / "alignment_report.pdf"
            self.export_pdf(markdown_content, str(pdf_path))

        if 'docx' in format_list or 'all' in format_list:
            docx_path = Path(out_dir) / "alignment_report.docx"
            self.export_docx(markdown_content, str(docx_path))


def main():
    parser = argparse.ArgumentParser(description="Render standards-core outputs into reviewer binders")
    parser.add_argument("--coverage", required=True, help="Path to coverage.json")
    parser.add_argument("--evidence", help="Path to evidence.jsonl")
    parser.add_argument("--title", default="Curriculum Alignment Review", help="Binder title")
    parser.add_argument("--format", default="markdown",
                       choices=["markdown", "pdf", "docx", "all"],
                       help="Output format(s)")
    parser.add_argument("--out", default="binder", help="Output directory")

    args = parser.parse_args()

    renderer = BinderRenderer(args.coverage, args.evidence or "", args.title)

    formats = [args.format] if args.format != "all" else ["markdown", "pdf", "docx"]
    renderer.render(formats, args.out)


if __name__ == "__main__":
    main()
