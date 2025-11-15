# Latin Corpus Toolkit

This directory contains a Python toolkit for building a unified bibliography of Latin works (c. 1450–1900).

## Getting started

1. Create a virtual environment and install the requirements:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Place raw catalogue exports (CSV/TSV) in `data/raw/`.
3. Run the toolkit modules (see `latin_corpus` package) to build the master bibliography. A full end-to-end build can be triggered with:

```bash
cd latin_corpus
python -m latin_corpus.main
```

This command consolidates catalogue exports, applies translation matching, assigns priority scores, and writes the result to `data/processed/latin_master_1450_1900.csv`.

Refer to the docstrings in the package for configuration notes and workflow guidance.
