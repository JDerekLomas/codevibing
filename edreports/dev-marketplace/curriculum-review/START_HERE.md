# 🚀 START HERE — One-Command Curriculum Review

**Just drag a PDF into your terminal and get a complete curriculum evaluation in seconds.**

---

## ⚡ 60-Second Setup

### 1. Install Dependencies (one time)

```bash
pip install pyyaml jinja2 pdfplumber
```

Optional (for PDF/DOCX export):
```bash
brew install pandoc  # macOS
apt install pandoc   # Linux
```

### 2. Run the Review

```bash
cd dev-marketplace/curriculum-review
./review.sh
```

Then drag your PDF into the terminal window and press Enter.

That's it. ✅

---

## 📊 What You'll Get

After ~10-30 seconds (depending on PDF size):

✅ **Coverage Matrix** — Which standards are taught, practiced, assessed
✅ **Evidence Report** — Quoted text from the textbook with exact page numbers
✅ **Professional PDF** — Share with colleagues/stakeholders
✅ **Word Document** — Edit and annotate

---

## 💡 Usage Examples

### Interactive Mode (easiest)
```bash
./review.sh
# Then drag textbook.pdf into terminal
```

### Direct Mode (one-liner)
```bash
./review.sh /path/to/textbook.pdf
```

### With Options
```bash
./review.sh textbook.pdf --grades 3-5
./review.sh textbook.pdf --no-open          # Don't open report
./review.sh textbook.pdf --verbose          # Debug mode
```

### Advanced
```bash
./review.sh textbook.pdf \
  --standards standards/my_standards.yaml \
  --grades 3,4,5 \
  --output /my/output/dir
```

---

## 🎯 What Happens Behind the Scenes

1. **📖 Extract Pages** — Pulls all text from PDF textbook
2. **📊 Align Standards** — Matches standards to textbook pages using keywords
3. **🔍 Find Evidence** — Captures quoted text and page numbers
4. **📋 Generate Report** — Creates professional Markdown/PDF/Word documents

All automatic. Zero configuration.

---

## 📁 Where's the Output?

After running, you'll see:

```
review_20251020_224400/
├── binder/                          # Final reports
│   ├── alignment_report.md          # Edit in any text editor
│   ├── alignment_report.pdf         # Share with stakeholders
│   └── alignment_report.docx        # Edit in Word
├── outputs/                         # Raw data (for power users)
│   ├── coverage.json                # Standards coverage matrix
│   ├── evidence.jsonl               # Quoted evidence with page anchors
│   └── pages.jsonl                  # Full-text page index
```

**Reports open automatically in your default editor!**

---

## ❓ Common Questions

### Q: What standards are included?
**A:** By default, CCSS Math for Grades 3-5. You can:
- Choose a different pack when prompted
- Create custom standards packs (YAML files in `standards/`)

### Q: What if my PDF is huge (500+ pages)?
**A:** It'll take 1-2 minutes but still works. The script processes sequentially.

### Q: Can I use this with ELA standards?
**A:** Yes! Create an `ela_standards.yaml` file or modify the default pack.

### Q: What if the standards pack keywords don't match my textbook?
**A:** Edit `standards/*.yaml` to add/remove keywords. Re-run the review. It's easy!

### Q: Do I need to know Python?
**A:** No. Just drag and drop. The script handles everything.

### Q: Can I export to Excel?
**A:** The output files are Markdown/PDF/Word. Use `outputs/coverage.json` for Excel import.

---

## 🔧 Troubleshooting

### "pip: command not found"
Your Python isn't set up. Try:
```bash
python3 -m pip install pyyaml jinja2 pdfplumber
```

### "No PDF extraction tools found"
Install pdfplumber:
```bash
pip install pdfplumber
```

### "File not found: /path/to/file"
Make sure you didn't add extra quotes. Drag directly into terminal:
```
./review.sh
# Then drag: /Users/yourname/Documents/math_textbook.pdf
```

### "ModuleNotFoundError: No module named 'yaml'"
Install dependencies:
```bash
pip install pyyaml jinja2 pdfplumber
```

### Report opens in wrong editor
Edit the script at the bottom of `review.py` to change the default editor.

---

## 📚 Next Steps

1. **Try it now** — Drag a PDF and wait 30 seconds
2. **Customize** — Edit `standards/ccss_math_grade3_sample.yaml` to match your textbook language
3. **Share** — Send the PDF report to colleagues
4. **Integrate** — Use in your curriculum review workflow

---

## 📖 Full Documentation

- **QUICKSTART.md** — 5-minute feature overview
- **README.md** — Complete guide with examples
- **MANIFEST.md** — Technical file inventory

---

## ✨ That's It!

No complexity. No configuration.

**Just PDF → Magic → Report.** ✅

---

**Questions?** Check `README.md` or run `./review.sh --help`
