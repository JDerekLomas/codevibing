#!/bin/bash
# review.sh — Curriculum Review Launcher
#
# Usage:
#   ./review.sh                          # Interactive (drag PDF into terminal)
#   ./review.sh /path/to/textbook.pdf    # Direct mode
#
# Works with:
#   - Drag & drop (paste path from terminal)
#   - Direct file paths
#   - Quoted paths with spaces

set -e

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_SCRIPT="$SCRIPT_DIR/review.py"

# Check if Python script exists
if [ ! -f "$PYTHON_SCRIPT" ]; then
    echo "❌ Error: review.py not found in $SCRIPT_DIR"
    exit 1
fi

# Check Python version
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is required but not installed"
    exit 1
fi

# Pass all arguments to Python script
python3 "$PYTHON_SCRIPT" "$@"
