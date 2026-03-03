# Curriculum Review Plugin — Quick Start Guide

Get started with standards alignment and evidence compilation in 5 minutes.

## Prerequisites

```bash
# Install Python dependencies
pip install pyyaml jinja2 pdfplumber

# Optional: for PDF/DOCX export
pip install pandoc
brew install pandoc  # macOS (or apt install pandoc on Linux)
```

## 1. Verify Plugin Structure

```bash
cd dev-marketplace/curriculum-review
ls -la

# You should see:
# .claude-plugin/plugin.json
# skills/standards-core/SKILL.md
# skills/evidence-binder/SKILL.md
# standards/ccss_math_grade3_sample.yaml
# README.md (this file)
```

## 2. Extract Pages from a Textbook

Get started with the sample Grade 3 Math standards:

```bash
mkdir -p outputs

python skills/standards-core/scripts/align_standards.py \
  --extract-pages /path/to/your/textbook.pdf \
  --out outputs
```

**Output:** `outputs/pages.jsonl` (full-text index of all pages)

### No PDF? Generate dummy pages for testing:

```bash
# Create a sample pages.jsonl for testing
cat > outputs/pages.jsonl << 'EOF'
{"book_id": "math_grade3", "page": 1, "text": "Chapter 1: Understanding Fractions. A fraction represents an equal part of a whole."}
{"book_id": "math_grade3", "page": 2, "text": "Lesson 1.1: Dividing into Equal Parts. When we partition a whole into equal parts, each part is one fraction."}
{"book_id": "math_grade3", "page": 3, "text": "Practice: On a number line, mark equal intervals and locate fractions like 1/2, 1/3, 1/4."}
{"book_id": "math_grade3", "page": 4, "text": "Assessment: Which fraction represents 2 equal parts of a whole? A) 1/2 B) 2/3 C) 3/4"}
EOF
```

## 3. Align Standards to Pages

Map the Grade 3 Math standards to your textbook:

```bash
python skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards standards/ccss_math_grade3_sample.yaml \
  --subject math \
  --grades 3 \
  --out outputs
```

**Outputs:**
- `outputs/coverage.json` — Coverage matrix (taught, practiced, assessed, intensity)
- `outputs/evidence.jsonl` — Quoted evidence with page anchors
- `outputs/pages.jsonl` — Full-text page index

### Check the results:

```bash
# View coverage summary
cat outputs/coverage.json | grep -A5 '"coverage_percent"'

# View evidence for first standard
head -1 outputs/evidence.jsonl | python -m json.tool
```

## 4. Generate a Reviewer Binder

Compile the alignment into a polished PDF/DOCX report:

```bash
python skills/evidence-binder/scripts/render_binder.py \
  --coverage outputs/coverage.json \
  --evidence outputs/evidence.jsonl \
  --title "Grade 3 Math Textbook Alignment Review" \
  --format all \
  --out binder
```

**Outputs:**
- `binder/alignment_report.md` — Markdown (for git/version control)
- `binder/alignment_report.pdf` — Professional PDF (for sharing)
- `binder/alignment_report.docx` — Editable Word doc (for markup)

### View the Markdown:

```bash
cat binder/alignment_report.md | head -50
```

## 5. Common Tasks

### Run with different grades (K, 1, 2)

You'll need to extend the standards pack first:

```bash
# Create a K-2 Math standards pack
cat > standards/ccss_math_k2.yaml << 'EOF'
standards:
  - id: "K.CC.A.1"
    grade: 0
    description: "Count to 100 by ones and tens"
    keywords: ["count", "ones", "tens"]
    anti_keywords: []
  - id: "1.NBT.A.1"
    grade: 1
    description: "Understand place value"
    keywords: ["place value", "tens", "ones"]
    anti_keywords: []
  - id: "2.NBT.A.1"
    grade: 2
    description: "Understand three-digit numbers"
    keywords: ["hundreds", "tens", "ones"]
    anti_keywords: []
EOF

python skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards standards/ccss_math_k2.yaml \
  --subject math \
  --grades 0,1,2 \
  --out outputs_k2
```

### Review coverage without exporting

```bash
# Just view the JSON
python -m json.tool outputs/coverage.json

# Or use jq if installed
jq '.summary' outputs/coverage.json
```

### Export only to PDF (faster)

```bash
python skills/evidence-binder/scripts/render_binder.py \
  --coverage outputs/coverage.json \
  --evidence outputs/evidence.jsonl \
  --format pdf \
  --out binder
```

### Create a custom standards pack

```bash
cat > standards/my_standards.yaml << 'EOF'
metadata:
  pack_name: "My Custom Standards"
  subject: "math"
  grades: [3, 4]

standards:
  - id: "CUSTOM.1"
    grade: 3
    description: "My first custom standard"
    keywords: ["keyword1", "keyword2"]
    anti_keywords: ["anti1"]
  - id: "CUSTOM.2"
    grade: 4
    description: "My second standard"
    keywords: ["pattern", "rule"]
    anti_keywords: []
EOF

# Then run alignment with your new pack
python skills/standards-core/scripts/align_standards.py \
  --pages outputs/pages.jsonl \
  --standards standards/my_standards.yaml \
  --subject math \
  --grades 3,4 \
  --out outputs_custom
```

## Troubleshooting

### "No module named 'pyyaml'"
```bash
pip install pyyaml
```

### "No module named 'pdfplumber'"
```bash
pip install pdfplumber
```

### PDF extraction gets no text
1. Verify the PDF is not scanned/image-based:
   ```bash
   pdftotext textbook.pdf -  | head -10
   ```
2. If no text, the PDF needs OCR (outside scope of this plugin)

### Evidence seems missing
Check the standards pack keywords match your textbook language:
1. Open `standards/ccss_math_grade3_sample.yaml`
2. Add more keywords that appear in your textbook
3. Re-run alignment

### Pandoc not found (PDF export fails)
```bash
# macOS
brew install pandoc

# Ubuntu/Debian
apt install pandoc

# Then retry export
python skills/evidence-binder/scripts/render_binder.py \
  --coverage outputs/coverage.json \
  --evidence outputs/evidence.jsonl \
  --format pdf \
  --out binder
```

## Next Steps

- 📖 Read full docs: `README.md`
- 🛠️ Explore skill details: `skills/standards-core/SKILL.md`, `skills/evidence-binder/SKILL.md`
- 📊 Check sample standards: `standards/ccss_math_grade3_sample.yaml`
- 🔧 Customize scripts: `skills/*/scripts/*.py`
- 📋 Review examples: `binder/alignment_report.md`

## Support

**Something not working?** Check:
1. Do all `outputs/` files exist? → Run extraction first
2. Is standards YAML valid? → `python -m yaml standards/my_standards.yaml`
3. Do PDF pages extract? → `head -1 outputs/pages.jsonl`
4. Is pandoc installed? → `pandoc --version` (only needed for PDF/DOCX export)

---

Happy aligning! 📚✅
