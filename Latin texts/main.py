#!/usr/bin/env python3
"""
Main script for generating the Latin master bibliography.

Usage:
    python main.py [--config config.json]
"""
import argparse
import sys
from pathlib import Path

from src.processor import create_processor_from_config, BibliographyProcessor
from src.catalogues import USTC, VD16, VD17, VD18, ESTC


def main():
    parser = argparse.ArgumentParser(
        description="Generate master bibliography of Latin printed works (1450-1900)"
    )
    parser.add_argument(
        "--config",
        type=Path,
        help="Path to configuration JSON file"
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("data/processed"),
        help="Output directory for processed files (default: data/processed)"
    )
    
    args = parser.parse_args()
    
    # Create processor
    if args.config:
        processor = create_processor_from_config(args.config, output_dir=args.output_dir)
    else:
        # Use default processor with all catalogues
        # Note: Data sources need to be configured in catalogue classes
        processor = BibliographyProcessor(
            catalogues=[USTC(), VD16(), VD17(), VD18(), ESTC()],
            output_dir=args.output_dir
        )
    
    # Process
    try:
        output_path = processor.process()
        print(f"\n✓ Success! Master bibliography created at: {output_path}")
        return 0
    except Exception as e:
        print(f"\n✗ Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    sys.exit(main())

