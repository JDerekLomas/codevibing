# Curriculum Review Plugin

A Claude Code plugin for K–12 curriculum quality assurance, standards alignment, and evidence compilation. Perfect for EdReports-style reviews and rigorous curriculum audits.

## Overview

The **curriculum-review** plugin provides two specialized Skills:

1. **`standards-core`** — Automated mapping of CCSS/state standards to textbook pages with coverage matrices and evidence anchors
2. **`evidence-binder`** — Compilation of quoted evidence into reviewer-ready Markdown, PDF, or DOCX reports

## Quick Start

### 1. Install and activate the plugin

```bash
# From Claude Code CLI
/plugin-add dev-marketplace/curriculum-review

# Or link locally for development
/plugin-link dev-marketplace/curriculum-review
```

### 2. Use the standards-core Skill

Map your Math or ELA textbook to standards:

```bash
# Extract pages from PDF
python dev-marketplace/curriculum-review/skills/standards-core/scripts/align_standards.py \
  --extract-pages textbook.pdf \
  --out outputs

# Align standards to pages
python dev-marketplace/curriculum-review/skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards dev-marketplace/curriculum-review/standards/ccss_math_grade3_sample.yaml \
  --subject math \
  --grades 3 \
  --out outputs
```

**Outputs:**
- `outputs/coverage.json` — Per-standard coverage flags, intensity, and off-grade metrics
- `outputs/evidence.jsonl` — Page-anchored quoted spans for each standard
- `outputs/pages.jsonl` — Full-text index of all textbook pages

### 3. Use the evidence-binder Skill

Compile standards-core outputs into a polished report:

```bash
python dev-marketplace/curriculum-review/skills/evidence-binder/scripts/render_binder.py \
  --coverage outputs/coverage.json \
  --evidence outputs/evidence.jsonl \
  --title "Grade 3 Math Textbook Review" \
  --format all \
  --out binder
```

**Outputs:**
- `binder/alignment_report.md` — Markdown (standards grouped by grade, evidence highlighted)
- `binder/alignment_report.pdf` — Professional PDF with TOC (requires pandoc)
- `binder/alignment_report.docx` — Editable Word document (requires pandoc)

## Features

### standards-core Skill

- **Keyword-based alignment**: Uses standard-specific lexicons (keywords + anti-keywords) to find matches
- **Page anchoring**: All evidence linked to `book_id:page:start:end` coordinates
- **Coverage metrics**: Tracks which standards are taught, practiced, assessed, and their intensity
- **Off-grade detection**: Flags content outside target grade range
- **Redundancy analysis**: Counts how many times a standard appears
- **Evidence validation**: Only marks standards as covered if evidence exists

**Input:** PDF textbook(s) + YAML standards pack
**Output:** JSON/CSV coverage matrix + JSONL evidence log

### evidence-binder Skill

- **Hierarchical organization**: Standards grouped by grade and coverage status
- **Executive summary**: Coverage %, taught/practiced/assessed counts
- **Full evidence display**: Quoted spans + page anchors for each standard
- **Multiple formats**: Markdown → PDF/DOCX conversion via pandoc
- **Uncovered standards list**: Highlights gaps for manual investigation
- **Audit trail**: Generation timestamps and standards pack version in footer

**Input:** coverage.json + evidence.jsonl
**Output:** Markdown/PDF/DOCX binder

## Standards Pack Format

Standards are defined in YAML with keywords and examples:

```yaml
standards:
  - id: "3.NF.A.1"
    grade: 3
    description: "Understand a fraction 1/b..."
    keywords:
      - "fraction"
      - "equal parts"
      - "denominator"
    anti_keywords:
      - "percent"
      - "decimal"
    examples:
      - "1/2 of a pizza"
      - "dividing a rectangle into 4 equal parts"
```

See `standards/ccss_math_grade3_sample.yaml` for a complete example.

## Directory Structure

```
curriculum-review/
├── .claude-plugin/
│   └── plugin.json                    # Plugin metadata
├── skills/
│   ├── standards-core/
│   │   ├── SKILL.md                   # Skill definition + workflow docs
│   │   └── scripts/
│   │       └── align_standards.py     # Main alignment engine
│   └── evidence-binder/
│       ├── SKILL.md                   # Skill definition + output examples
│       ├── scripts/
│       │   └── render_binder.py       # Binder rendering engine
│       └── templates/
│           └── binder_base.jinja2     # Markdown template (future)
├── standards/
│   └── ccss_math_grade3_sample.yaml   # Sample CCSS standards pack
└── README.md                           # This file
```

## Dependencies

### Required
- Python 3.8+
- `pyyaml` — for standards pack parsing
- `jinja2` — for Markdown templating (evidence-binder)

### Optional
- `pdfplumber` — for PDF text extraction (auto-fallback to pdftotext)
- `pandoc` — for PDF/DOCX export from Markdown

### Install dependencies

```bash
pip install pyyaml jinja2 pdfplumber

# Optional: for PDF export
brew install pandoc  # macOS
apt install pandoc   # Linux
choco install pandoc # Windows
```

## Workflow Example: Complete K-3 Math Review

```bash
# 1. Prepare standards pack (or use sample)
cp dev-marketplace/curriculum-review/standards/ccss_math_grade3_sample.yaml standards/my_standards.yaml

# 2. Extract and align Grade 3 textbook
python skills/standards-core/scripts/align_standards.py \
  --extract-pages Grade3_Math_Student_Edition.pdf \
  --out outputs

python skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards standards/my_standards.yaml \
  --subject math \
  --grades 3 \
  --out outputs

# 3. Review coverage metrics
cat outputs/coverage.json
# Shows: 12/15 standards covered (80%), 3 uncovered

# 4. Generate binder
python skills/evidence-binder/scripts/render_binder.py \
  --coverage outputs/coverage.json \
  --evidence outputs/evidence.jsonl \
  --title "Grade 3 Math Textbook Alignment Review" \
  --format all \
  --out binder

# 5. Share reports
# binder/alignment_report.pdf   ← Share with stakeholders
# binder/alignment_report.docx  ← Open in Word for markup
# binder/alignment_report.md    ← Version control in git
```

## Key Concepts

### Coverage Flags
- **taught**: Standard is explicitly instructed
- **practiced**: Students engage in practice/exercises
- **assessed**: Standard appears in assessment/quiz items

### Intensity
- **high**: Multiple occurrences across textbook
- **medium**: Few occurrences
- **none**: Not found

### Evidence Anchors
All quoted evidence is anchored as `book_id:page:start:end` for direct verification:
```
math_grade3:12:45:92
├─ book_id: math_grade3
├─ page: 12
├─ start_char: 45
└─ end_char: 92
```

## Troubleshooting

### PDF extraction fails
```bash
# Check if pdfplumber is installed
python -c "import pdfplumber; print(pdfplumber.__version__)"

# Install or upgrade
pip install --upgrade pdfplumber

# Fallback: ensure pdftotext is available
brew install poppler  # macOS
apt install poppler-utils  # Linux
```

### No standards aligned
1. Verify standards pack YAML is valid: `python -m yaml standards/my_standards.yaml`
2. Check that PDF text extraction worked: `cat outputs/pages.jsonl | head -1`
3. Adjust keywords in standards pack to match textbook language

### PDF/DOCX export fails
```bash
# Install pandoc
brew install pandoc

# Verify it works
pandoc --version

# Export manually
pandoc outputs/alignment_report.md -o outputs/alignment_report.pdf
```

## Best Practices

1. **Validate standards pack**: Test with a small sample before full run
2. **Review evidence**: Always spot-check quoted spans and page anchors
3. **Iterative refinement**: Adjust keywords based on first-pass results
4. **Version control**: Commit standards packs and outputs to git for audit trail
5. **Use page anchors**: Leverage `book_id:page:start:end` for rapid verification

## Advanced: Custom Standards Packs

Create a YAML file for any standards framework:

```yaml
metadata:
  pack_name: "State XYZ ELA Grade 5"
  version: "1.0.0"
  subject: "ela"

standards:
  - id: "5.RL.1.1"
    grade: 5
    description: "Cite textual evidence..."
    keywords:
      - "cite"
      - "textual evidence"
      - "support"
    anti_keywords:
      - "paraphrase"
    examples:
      - "Quoting from the text to support ideas"
```

Then run:
```bash
python skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards standards/state_xyz_ela_grade5.yaml \
  --subject ela \
  --grades 5 \
  --out outputs
```

## Contributing

To extend the plugin:

1. **Add new standards packs**: Create YAML files in `standards/`
2. **Custom templates**: Modify `skills/evidence-binder/templates/binder_base.jinja2`
3. **New export formats**: Add methods to `BinderRenderer` in `render_binder.py`
4. **PDF metadata**: Enhance PDF generation with title/author in pandoc calls

## License

Curriculum Review Plugin © 2025. For use with Claude Code in EdReports and K-12 curriculum review contexts.

## Support

- Plugin documentation: See `skills/*/SKILL.md`
- Sample data: `standards/ccss_math_grade3_sample.yaml`
- Example workflow: See "Workflow Example: Complete K-3 Math Review" above
