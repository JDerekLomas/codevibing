#!/usr/bin/env python3
"""
review.py — One-Command Curriculum Review

Usage:
  python review.py                          # Interactive mode (drag PDF into terminal)
  python review.py /path/to/textbook.pdf   # Direct mode
  python review.py --help                  # Show options

This script handles everything:
  1. Extract PDF pages
  2. Align to standards
  3. Generate alignment report
  4. Open the report in your browser/editor

Zero config needed. Just provide a PDF.
"""

import argparse
import sys
import os
import json
import subprocess
from pathlib import Path
from datetime import datetime
import shutil
import time

# Add skills to path
PLUGIN_DIR = Path(__file__).parent
sys.path.insert(0, str(PLUGIN_DIR / "skills" / "standards-core" / "scripts"))
sys.path.insert(0, str(PLUGIN_DIR / "skills" / "evidence-binder" / "scripts"))

try:
    from align_standards import StandardsAligner
except ImportError:
    print("Error: Could not import StandardsAligner. Make sure you're in the plugin directory.")
    sys.exit(1)

try:
    from render_binder import BinderRenderer
except ImportError:
    print("Error: Could not import BinderRenderer. Make sure you're in the plugin directory.")
    sys.exit(1)


class CurriculumReviewCLI:
    """One-command curriculum review orchestrator."""

    def __init__(self, verbose=False, open_report=True):
        self.verbose = verbose
        self.open_report = open_report
        self.plugin_dir = PLUGIN_DIR
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    def log(self, msg: str, level: str = "INFO"):
        """Print log message."""
        if level == "DEBUG" and not self.verbose:
            return
        prefix = "  " if level != "INFO" else ""
        print(f"{prefix}[{level}] {msg}")

    def check_dependencies(self):
        """Verify all required dependencies are installed."""
        self.log("Checking dependencies...")

        required = ["yaml", "jinja2"]
        missing = []

        for module in required:
            try:
                __import__(module)
                self.log(f"  ✓ {module}", "DEBUG")
            except ImportError:
                missing.append(module)

        optional = ["pdfplumber", "pdftotext"]
        pdf_tools = []
        for module in optional:
            try:
                if module == "pdftotext":
                    subprocess.run(["which", "pdftotext"], capture_output=True, check=True)
                else:
                    __import__(module)
                pdf_tools.append(module)
                self.log(f"  ✓ {module}", "DEBUG")
            except (ImportError, subprocess.CalledProcessError):
                pass

        if missing:
            print(f"\n❌ Missing required dependencies: {', '.join(missing)}")
            print(f"\nInstall with:")
            print(f"  pip install {' '.join(missing)}")
            sys.exit(1)

        if not pdf_tools:
            print(f"\n⚠️  No PDF extraction tools found (pdfplumber or pdftotext)")
            print(f"\nInstall one of these:")
            print(f"  pip install pdfplumber")
            print(f"  or")
            print(f"  brew install poppler  # macOS")
            print(f"  apt install poppler-utils  # Linux")
            sys.exit(1)

        self.log("✓ All dependencies OK")

    def get_pdf_path(self, pdf_arg=None):
        """Get PDF path from argument or interactive input."""
        if pdf_arg:
            pdf_path = Path(pdf_arg)
            if not pdf_path.exists():
                print(f"❌ File not found: {pdf_arg}")
                sys.exit(1)
            if pdf_path.suffix.lower() != ".pdf":
                print(f"❌ Not a PDF file: {pdf_arg}")
                sys.exit(1)
            return pdf_path

        # Interactive mode
        print("\n" + "=" * 70)
        print("📚 CURRICULUM REVIEW — One-Command Evaluation")
        print("=" * 70)
        print("\n💡 Drag a PDF textbook into this terminal, then press Enter.")
        print("   (Or paste the file path and press Enter)")
        print("\n", end="")

        pdf_input = input("📁 PDF path: ").strip()

        if not pdf_input:
            print("❌ No file provided.")
            sys.exit(1)

        # Handle quoted paths (from drag-and-drop)
        pdf_input = pdf_input.strip("'\"")

        pdf_path = Path(pdf_input)
        if not pdf_path.exists():
            print(f"❌ File not found: {pdf_input}")
            sys.exit(1)

        if pdf_path.suffix.lower() != ".pdf":
            print(f"❌ Not a PDF file: {pdf_input}")
            sys.exit(1)

        return pdf_path

    def prompt_standards_pack(self):
        """Let user choose or create standards pack."""
        print("\n" + "-" * 70)
        print("Standards Pack Selection")
        print("-" * 70)

        standards_dir = self.plugin_dir / "standards"
        yaml_files = list(standards_dir.glob("*.yaml"))

        if yaml_files:
            print(f"\n📦 Available standards packs:")
            for i, f in enumerate(yaml_files, 1):
                print(f"  {i}. {f.stem}")
            print(f"  {len(yaml_files) + 1}. Use default (CCSS Math Grade 3)")

            choice = input(f"\nSelect pack (1-{len(yaml_files) + 1}): ").strip()

            try:
                choice_num = int(choice)
                if 1 <= choice_num <= len(yaml_files):
                    return yaml_files[choice_num - 1]
            except ValueError:
                pass

        # Default
        default_pack = standards_dir / "ccss_math_grade3_sample.yaml"
        if default_pack.exists():
            print(f"→ Using: {default_pack.name}")
            return default_pack

        print(f"❌ No standards packs found in {standards_dir}")
        sys.exit(1)

    def prompt_grades(self):
        """Prompt user for grade range."""
        print("\n" + "-" * 70)
        print("Grade Range")
        print("-" * 70)
        print("\nExamples: '3' or '3-5' or '3,4,5'")

        grades_input = input("📊 Grades to analyze (default: 3): ").strip()

        if not grades_input:
            return "3"

        return grades_input

    def run_review(self, pdf_path: Path, standards_pack: Path, grades: str, output_dir: Path):
        """Run the complete review pipeline."""
        print("\n" + "=" * 70)
        print("🔄 PROCESSING")
        print("=" * 70)

        # Create working directories
        outputs_dir = output_dir / "outputs"
        binder_dir = output_dir / "binder"
        outputs_dir.mkdir(parents=True, exist_ok=True)
        binder_dir.mkdir(parents=True, exist_ok=True)

        # Step 1: Extract pages
        print(f"\n📖 Step 1: Extracting pages from PDF...")
        try:
            aligner = StandardsAligner(str(standards_pack), "math", grades)
            aligner.extract_pages(str(pdf_path), str(outputs_dir))
            self.log("✓ Pages extracted", "DEBUG")
        except Exception as e:
            print(f"❌ PDF extraction failed: {e}")
            if self.verbose:
                import traceback
                traceback.print_exc()
            sys.exit(1)

        # Step 2: Align standards
        print(f"📊 Step 2: Aligning to standards...")
        try:
            pages_jsonl = outputs_dir / "pages.jsonl"
            if not pages_jsonl.exists():
                print(f"❌ Page index not found: {pages_jsonl}")
                sys.exit(1)

            aligner = StandardsAligner(str(standards_pack), "math", grades)
            evidence = aligner.align_pages(str(pages_jsonl), str(outputs_dir))
            aligner.write_outputs(evidence, str(outputs_dir))
            self.log("✓ Standards aligned", "DEBUG")
        except Exception as e:
            print(f"❌ Standards alignment failed: {e}")
            if self.verbose:
                import traceback
                traceback.print_exc()
            sys.exit(1)

        # Step 3: Generate binder
        print(f"📋 Step 3: Generating alignment report...")
        try:
            coverage_json = outputs_dir / "coverage.json"
            evidence_jsonl = outputs_dir / "evidence.jsonl"

            if not coverage_json.exists():
                print(f"❌ Coverage data not found: {coverage_json}")
                sys.exit(1)

            pdf_name = pdf_path.stem
            title = f"{pdf_name} — Curriculum Alignment Review"

            renderer = BinderRenderer(str(coverage_json), str(evidence_jsonl), title)
            renderer.render(["markdown"], str(binder_dir))
            self.log("✓ Markdown report generated", "DEBUG")

            # Try PDF/DOCX export (optional)
            try:
                renderer.render(["pdf"], str(binder_dir))
                self.log("✓ PDF generated", "DEBUG")
            except Exception as e:
                self.log(f"PDF export skipped: {e}", "DEBUG")

            try:
                renderer.render(["docx"], str(binder_dir))
                self.log("✓ DOCX generated", "DEBUG")
            except Exception as e:
                self.log(f"DOCX export skipped: {e}", "DEBUG")

        except Exception as e:
            print(f"❌ Report generation failed: {e}")
            if self.verbose:
                import traceback
                traceback.print_exc()
            sys.exit(1)

        return outputs_dir, binder_dir

    def display_results(self, outputs_dir: Path, binder_dir: Path):
        """Display results and file locations."""
        print("\n" + "=" * 70)
        print("✅ REVIEW COMPLETE")
        print("=" * 70)

        # Coverage summary
        coverage_file = outputs_dir / "coverage.json"
        if coverage_file.exists():
            with open(coverage_file, 'r') as f:
                coverage = json.load(f)
                summary = coverage.get('summary', {})
                print(f"\n📊 Coverage Summary:")
                print(f"   Total Standards: {coverage.get('metadata', {}).get('total_standards', '?')}")
                print(f"   Covered: {summary.get('total_covered', '?')} ({summary.get('coverage_percent', '?')}%)")
                print(f"   Uncovered: {summary.get('total_uncovered', '?')}")

        # Output files
        print(f"\n📁 Output Files:")
        report_md = binder_dir / "alignment_report.md"
        report_pdf = binder_dir / "alignment_report.pdf"
        report_docx = binder_dir / "alignment_report.docx"

        if report_md.exists():
            print(f"   ✓ Markdown:  {report_md}")
        if report_pdf.exists():
            print(f"   ✓ PDF:       {report_pdf}")
        if report_docx.exists():
            print(f"   ✓ Word Doc:  {report_docx}")

        evidence_jsonl = outputs_dir / "evidence.jsonl"
        if evidence_jsonl.exists():
            print(f"   ✓ Evidence:  {evidence_jsonl}")

        # Open report
        print(f"\n" + "-" * 70)
        if self.open_report and report_md.exists():
            print(f"Opening report...")
            try:
                if sys.platform == "darwin":
                    subprocess.run(["open", str(report_md)])
                elif sys.platform == "linux":
                    subprocess.run(["xdg-open", str(report_md)])
                elif sys.platform == "win32":
                    subprocess.run(["start", str(report_md)], shell=True)
            except Exception as e:
                print(f"⚠️  Could not open report: {e}")
                print(f"   Open manually: {report_md}")

        print(f"\n✨ All done! Your curriculum evaluation is ready.")

    def run(self, pdf_arg=None, standards_pack_arg=None, grades_arg=None, output_dir_arg=None):
        """Execute the complete review workflow."""
        # Check dependencies
        self.check_dependencies()

        # Get inputs
        pdf_path = self.get_pdf_path(pdf_arg)
        print(f"\n📁 Selected: {pdf_path.name}")

        standards_pack = Path(standards_pack_arg) if standards_pack_arg else self.prompt_standards_pack()
        grades = grades_arg or self.prompt_grades()

        # Set output directory
        if output_dir_arg:
            output_dir = Path(output_dir_arg)
        else:
            output_dir = Path.cwd() / f"review_{self.timestamp}"

        output_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n⚙️  Configuration:")
        print(f"   PDF: {pdf_path.name}")
        print(f"   Standards: {standards_pack.name}")
        print(f"   Grades: {grades}")
        print(f"   Output: {output_dir}")

        # Run the pipeline
        outputs_dir, binder_dir = self.run_review(pdf_path, standards_pack, grades, output_dir)

        # Display results
        self.display_results(outputs_dir, binder_dir)

        return binder_dir / "alignment_report.md"


def main():
    parser = argparse.ArgumentParser(
        description="One-command curriculum review: PDF → standards alignment → professional report",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python review.py                                    # Interactive mode
  python review.py /path/to/textbook.pdf              # Direct mode
  python review.py textbook.pdf --grades 3-5          # With grade range
  python review.py textbook.pdf --no-open             # Skip opening report
  python review.py textbook.pdf --verbose             # Debug output
        """,
    )

    parser.add_argument("pdf", nargs="?", help="Path to PDF textbook (or drag into terminal)")
    parser.add_argument(
        "--standards",
        help="Path to standards pack YAML",
    )
    parser.add_argument(
        "--grades",
        help="Grade range: '3' or '3-5' or '3,4,5'",
    )
    parser.add_argument(
        "--output",
        help="Output directory (default: review_TIMESTAMP/)",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Don't open report in editor",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Show debug output",
    )

    args = parser.parse_args()

    cli = CurriculumReviewCLI(verbose=args.verbose, open_report=not args.no_open)

    try:
        cli.run(
            pdf_arg=args.pdf,
            standards_pack_arg=args.standards,
            grades_arg=args.grades,
            output_dir_arg=args.output,
        )
    except KeyboardInterrupt:
        print("\n\n⏹️  Cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
