#!/bin/bash
# demo.sh — Quick demo of the curriculum review system
#
# This creates a sample PDF and runs a complete review
# No real PDF needed — uses generated test data

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_DIR="$SCRIPT_DIR/demo_output"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  CURRICULUM REVIEW — Live Demo                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"

# Create demo directory
mkdir -p "$DEMO_DIR"
cd "$SCRIPT_DIR"

echo ""
echo "📦 Setting up demo..."

# Create a sample pages.jsonl (simulates PDF extraction)
cat > "$DEMO_DIR/pages.jsonl" << 'EOF'
{"book_id": "demo_math_grade3", "page": 1, "text": "Chapter 1: Understanding Fractions. A fraction represents an equal part of a whole. When we partition a whole into equal parts, each part is one fraction of the whole."}
{"book_id": "demo_math_grade3", "page": 2, "text": "Lesson 1.1: Dividing into Equal Parts. Students learn to divide shapes into equal parts. A fraction is formed when a whole is divided into equal parts. Each part represents 1/b where b is the number of parts."}
{"book_id": "demo_math_grade3", "page": 3, "text": "Practice: Draw circles and divide into equal parts. Create fractions like 1/2, 1/3, 1/4. Label the numerator and denominator. Understand that equal parts means same size."}
{"book_id": "demo_math_grade3", "page": 4, "text": "Assessment: Which shape shows 1/2? Which shows 1/4? Count equal parts and write the fraction. Multiple choice questions about fractions and equal parts."}
{"book_id": "demo_math_grade3", "page": 5, "text": "Lesson 1.2: Fractions on a Number Line. On a number line, we can mark equal intervals. Each interval represents a fraction. Locate 1/2, 1/3, 1/4 on the number line."}
{"book_id": "demo_math_grade3", "page": 6, "text": "Practice: Plot fractions on number lines. Mark equal intervals. Place 1/2 at the midpoint. Practice problems with different denominators."}
{"book_id": "demo_math_grade3", "page": 7, "text": "Equivalent Fractions: Two fractions are equivalent if they represent the same amount. 1/2 equals 2/4 equals 3/6. Visual models show equivalent fractions."}
{"book_id": "demo_math_grade3", "page": 8, "text": "Chapter 2: Operations with Whole Numbers. Multiplication: interpret products as equal groups. 3 groups of 5 objects equals 3 × 5 = 15."}
{"book_id": "demo_math_grade3", "page": 9, "text": "Arrays: visualize multiplication using rectangular arrays. A 3 × 4 array shows multiplication facts. Rows and columns."}
{"book_id": "demo_math_grade3", "page": 10, "text": "Word Problems: multi-step problems involve multiple operations. Interpret remainders in division. Solve problems with real-world context."}
EOF

echo "✓ Sample page data created"

# Extract standards and create a minimal alignment
python3 << 'PYSCRIPT'
import json
import sys

# Simulate alignment results
coverage = {
    "metadata": {
        "subject": "math",
        "grades": "3-5",
        "books": ["demo_math_grade3"],
        "total_standards": 5
    },
    "standards": [
        {
            "id": "3.NF.A.1",
            "grade": 3,
            "taught": True,
            "practiced": True,
            "assessed": True,
            "intensity": "high",
            "off_grade_percent": 0,
            "redundancy_count": 3,
            "evidence_found": True,
            "top_pages": [1, 2, 3],
            "rationale": "Clear instruction with multiple practice activities"
        },
        {
            "id": "3.NF.A.2",
            "grade": 3,
            "taught": True,
            "practiced": True,
            "assessed": False,
            "intensity": "medium",
            "off_grade_percent": 0,
            "redundancy_count": 2,
            "evidence_found": True,
            "top_pages": [5, 6],
            "rationale": "Taught with practice on number lines"
        },
        {
            "id": "3.NF.A.3a",
            "grade": 3,
            "taught": True,
            "practiced": False,
            "assessed": False,
            "intensity": "low",
            "off_grade_percent": 0,
            "redundancy_count": 1,
            "evidence_found": True,
            "top_pages": [7],
            "rationale": "Introduced with visual models"
        },
        {
            "id": "3.OA.A.1",
            "grade": 3,
            "taught": True,
            "practiced": True,
            "assessed": False,
            "intensity": "high",
            "off_grade_percent": 0,
            "redundancy_count": 2,
            "evidence_found": True,
            "top_pages": [8, 9],
            "rationale": "Multiplication as equal groups with arrays"
        },
        {
            "id": "4.OA.A.3",
            "grade": 4,
            "taught": False,
            "practiced": False,
            "assessed": False,
            "intensity": "none",
            "off_grade_percent": 0,
            "redundancy_count": 0,
            "evidence_found": False,
            "top_pages": [],
            "unrated": "evidence not found"
        }
    ],
    "summary": {
        "total_covered": 4,
        "total_uncovered": 1,
        "coverage_percent": 80
    }
}

evidence = [
    {"standard": "3.NF.A.1", "pages": [1, 2, 3], "top_hit": {"page": 1, "book_id": "demo_math_grade3", "quote": "A fraction represents an equal part of a whole. When we partition a whole into equal parts, each part is one fraction.", "anchor": "demo_math_grade3:1:0:100", "context": "Chapter introduction"}},
    {"standard": "3.NF.A.2", "pages": [5, 6], "top_hit": {"page": 5, "book_id": "demo_math_grade3", "quote": "On a number line, we can mark equal intervals. Each interval represents a fraction.", "anchor": "demo_math_grade3:5:0:80", "context": "Lesson 1.2 introduction"}},
    {"standard": "3.NF.A.3a", "pages": [7], "top_hit": {"page": 7, "book_id": "demo_math_grade3", "quote": "Two fractions are equivalent if they represent the same amount. 1/2 equals 2/4.", "anchor": "demo_math_grade3:7:0:70", "context": "Equivalent fractions"}},
    {"standard": "3.OA.A.1", "pages": [8, 9], "top_hit": {"page": 8, "book_id": "demo_math_grade3", "quote": "Interpret products as equal groups. 3 groups of 5 objects equals 3 × 5 = 15.", "anchor": "demo_math_grade3:8:50:120", "context": "Multiplication introduction"}},
    {"standard": "4.OA.A.3", "unrated": "evidence not found"}
]

# Write outputs
with open('demo_output/coverage.json', 'w') as f:
    json.dump(coverage, f, indent=2)

with open('demo_output/evidence.jsonl', 'w') as f:
    for e in evidence:
        f.write(json.dumps(e) + '\n')

print("✓ Coverage matrix created")
print("✓ Evidence data created")
PYSCRIPT

echo ""
echo "📋 Generating alignment report..."

# Create markdown report directly (no dependencies needed)
cat > "$DEMO_DIR/alignment_report.md" << 'MDFILE'
# Curriculum Alignment Review
## Demo Textbook — Grade 3 Math

**Subject:** Math
**Grades:** 3
**Books:** demo_math_grade3
**Review Date:** 2025-10-20

---

## Executive Summary

- **Total Standards:** 5
- **Covered:** 4 (80%)
- **Uncovered:** 1
- **Off-Grade Content:** 0%

---

## Standards Coverage by Grade

### Grade 3

#### 3.NF.A.1 — Understand a fraction 1/b as the quantity formed by 1 part when a whole is partitioned into b equal parts

**Status:** ✓ Taught | **Practiced:** ✓ | **Assessed:** ✓

**Intensity:** High
**Evidence:** Found

**Key Pages:** 1, 2, 3

**Top Evidence:**
> A fraction represents an equal part of a whole. When we partition a whole into equal parts, each part is one fraction.
>
> — *demo_math_grade3, Page 1* [`demo_math_grade3:1:0:100`]

**Context:** Chapter introduction

**Note:** This standard appears 3 times across the textbook, suggesting strong emphasis.

---

#### 3.NF.A.2 — Understand a fraction as a number on the number line; represent fractions on a number line diagram

**Status:** ✓ Taught | **Practiced:** ✓ | **Assessed:** ✗

**Intensity:** Medium
**Evidence:** Found

**Key Pages:** 5, 6

**Top Evidence:**
> On a number line, we can mark equal intervals. Each interval represents a fraction.
>
> — *demo_math_grade3, Page 5* [`demo_math_grade3:5:0:80`]

**Context:** Lesson 1.2 introduction

---

#### 3.NF.A.3a — Understand two fractions as equivalent (equal) if they are the same size

**Status:** ✓ Taught | **Practiced:** ✗ | **Assessed:** ✗

**Intensity:** Low
**Evidence:** Found

**Key Pages:** 7

**Top Evidence:**
> Two fractions are equivalent if they represent the same amount. 1/2 equals 2/4.
>
> — *demo_math_grade3, Page 7* [`demo_math_grade3:7:0:70`]

**Context:** Equivalent fractions

---

#### 3.OA.A.1 — Interpret products of whole numbers

**Status:** ✓ Taught | **Practiced:** ✓ | **Assessed:** ✗

**Intensity:** High
**Evidence:** Found

**Key Pages:** 8, 9

**Top Evidence:**
> Interpret products as equal groups. 3 groups of 5 objects equals 3 × 5 = 15.
>
> — *demo_math_grade3, Page 8* [`demo_math_grade3:8:50:120`]

**Context:** Multiplication introduction

**Note:** This standard appears 2 times across the textbook.

---

### Grade 4

#### 4.OA.A.3 — Solve multistep word problems with whole numbers and interpret remainders

**Status:** ✗ Taught | **Practiced:** ✗ | **Assessed:** ✗

**Intensity:** None
**Evidence:** NOT FOUND

⚠️ **NO EVIDENCE FOUND** — This standard may not be adequately covered in the textbook.

---

## Uncovered Standards

The following standards lack evidence in the provided materials:

- **4.OA.A.3** (Grade 4)

---

## Methodology Notes

This alignment review was conducted using automated standards-mapping software. All evidence references include page anchors (`book_id:page:start:end`) for direct verification.

**Generated:** 2025-10-20
MDFILE

echo "✓ Markdown report generated"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ DEMO COMPLETE                                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Coverage Summary:"
echo "   • Total Standards: 5"
echo "   • Covered: 4 (80%)"
echo "   • Uncovered: 1"
echo ""
echo "📁 Output files:"
echo ""
ls -lh "$DEMO_DIR"/ | awk 'NR>1 {printf "   %-40s %6s\n", $9, $5}'
echo ""
echo "📖 View the report:"
echo "   cat $DEMO_DIR/alignment_report.md"
echo ""
echo "💡 Now try with a real PDF:"
echo "   ./review.sh /path/to/your/textbook.pdf"
echo ""
