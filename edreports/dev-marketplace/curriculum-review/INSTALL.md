# Installation & Setup Guide

## What You're Getting

A **one-command curriculum review system** that converts PDF textbooks into standards alignment reports:

```
Textbook PDF  →  [extract pages]  →  [align to standards]  →  Professional Report
```

No configuration. No complexity. Just drag and drop.

---

## Prerequisites

- **Python 3.8+** (`python3 --version`)
- **macOS, Linux, or Windows** (with bash or WSL)

That's it.

---

## Step 1: Install Python Dependencies (2 minutes)

```bash
pip install pyyaml jinja2 pdfplumber
```

Or with Python 3:
```bash
python3 -m pip install pyyaml jinja2 pdfplumber
```

**What these do:**
- `pyyaml` — Reads standards definitions
- `jinja2` — Renders report templates
- `pdfplumber` — Extracts text from PDFs

**Optional: For PDF/DOCX export**
```bash
brew install pandoc      # macOS
apt install pandoc       # Linux
choco install pandoc     # Windows
```

---

## Step 2: Navigate to Plugin Directory

```bash
cd dev-marketplace/curriculum-review
```

---

## Step 3: Try the Demo (30 seconds)

```bash
./demo.sh
```

You'll see:
```
✓ Sample page data created
✓ Coverage matrix created
✓ Evidence data created
✓ Markdown report generated

📊 Coverage Summary:
   • Total Standards: 5
   • Covered: 4 (80%)
   • Uncovered: 1

📁 Output files:
   alignment_report.md        2.8K
   coverage.json              1.9K
   evidence.jsonl             1.1K
   pages.jsonl                2.0K
```

View the generated report:
```bash
cat demo_output/alignment_report.md
```

✅ **If demo works, you're ready to go!**

---

## Step 4: Run with Your First PDF

```bash
./review.sh
```

Then:
1. Drag your PDF textbook into the terminal window
2. Press Enter
3. Choose a standards pack when prompted (or use default)
4. Choose grade range when prompted (or use default: 3)
5. Wait 10-60 seconds (depending on PDF size)
6. Open the generated report 📖

That's it!

---

## Troubleshooting Setup

### "pip: command not found"

Try:
```bash
python3 -m pip install pyyaml jinja2 pdfplumber
```

Or on macOS with Homebrew:
```bash
brew install python3
python3 -m pip install pyyaml jinja2 pdfplumber
```

### "ModuleNotFoundError: No module named 'pyyaml'"

You didn't install dependencies. Try:
```bash
pip install --upgrade pip
pip install pyyaml jinja2 pdfplumber
```

### "No module named 'pdfplumber'"

Install PDF extraction tools:
```bash
pip install pdfplumber
```

Or if pdfplumber fails:
```bash
brew install poppler  # macOS
apt install poppler-utils  # Linux
```

### "./review.sh: Permission denied"

Make scripts executable:
```bash
chmod +x review.sh demo.sh review.py
```

### "Command not found: python3"

Install Python 3:
- **macOS:** `brew install python3`
- **Linux:** `apt install python3`
- **Windows:** Download from python.org or use WSL

### Demo runs but review.sh doesn't work

Make sure you're in the right directory:
```bash
cd dev-marketplace/curriculum-review
./review.sh
```

---

## Verify Installation

Check that everything is installed:

```bash
# Python version
python3 --version

# Required modules
python3 -c "import yaml; import jinja2; import pdfplumber; print('✓ All dependencies OK')"

# Script permissions
ls -la review.sh review.py
# Look for: -rwxr-xr-x (the 'x' means executable)

# Run demo
./demo.sh
```

If all commands return ✓, you're ready!

---

## First Run — What to Expect

### Command
```bash
./review.sh
```

### You'll see
```
╔════════════════════════════════════════════════════════╗
║  📚 CURRICULUM REVIEW — One-Command Evaluation       ║
╚════════════════════════════════════════════════════════╝

💡 Drag a PDF textbook into this terminal, then press Enter.
   (Or paste the file path and press Enter)

📁 PDF path:
```

### Drag your file
- Drag a .pdf file from Finder (macOS) or File Explorer (Windows) into the terminal
- Or paste the path: `/Users/yourname/Documents/math_textbook.pdf`
- Press Enter

### You'll be asked
```
📦 Available standards packs:
  1. ccss_math_grade3_sample
  2. Use default (CCSS Math Grade 3)

Select pack (1-2): 1
→ Using: ccss_math_grade3_sample.yaml
```

### Then
```
📊 Grades to analyze (default: 3): 3
```

### Processing
```
📖 Step 1: Extracting pages from PDF...
  ✓ Pages extracted

📊 Step 2: Aligning to standards...
  ✓ Standards aligned

📋 Step 3: Generating alignment report...
  ✓ Markdown report generated
  ✓ PDF generated
  ✓ DOCX generated
```

### Results
```
✅ REVIEW COMPLETE
═════════════════════════════════════════════════════════

📊 Coverage Summary:
   Total Standards: 8
   Covered: 6 (75%)
   Uncovered: 2

📁 Output Files:
   ✓ Markdown:  /Users/yourname/review_20251020_224400/binder/alignment_report.md
   ✓ PDF:       /Users/yourname/review_20251020_224400/binder/alignment_report.pdf
   ✓ Word Doc:  /Users/yourname/review_20251020_224400/binder/alignment_report.docx
   ✓ Evidence:  /Users/yourname/review_20251020_224400/outputs/evidence.jsonl

✨ All done! Your curriculum evaluation is ready.
```

**Report opens automatically in your default editor!**

---

## Next Steps After Setup

1. ✅ **Run the demo** — Verify installation
2. 📖 **Try with your first PDF** — Drag and drop
3. 📊 **Review the output** — Check coverage %, evidence, highlighted gaps
4. 🎯 **Customize standards** — Edit `standards/*.yaml` to match your textbooks
5. 📋 **Share reports** — Send PDF to colleagues or import to EdReports

---

## Getting Help

- **Can't install?** → Check "Troubleshooting Setup" above
- **What's next?** → Read `START_HERE.md` for quick examples
- **Full features?** → Read `README.md`
- **Technical details?** → Read `MANIFEST.md` or skill `SKILL.md` files

---

## Quick Reference

```bash
# Setup
pip install pyyaml jinja2 pdfplumber
cd dev-marketplace/curriculum-review

# Test
./demo.sh

# Run
./review.sh

# Options
./review.sh /path/to/textbook.pdf                    # Direct mode
./review.sh textbook.pdf --grades 3-5               # Custom grades
./review.sh textbook.pdf --no-open                  # Skip opening report
./review.sh textbook.pdf --verbose                  # Debug mode
./review.sh --help                                   # Show all options
```

---

## That's It! 🎉

You're ready to review curricula. Drag your first PDF and see what you get.

Questions? → Read `START_HERE.md`
