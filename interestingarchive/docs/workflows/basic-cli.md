# Basic CLI Workflow

Prototype runner for the textbook metadata pipeline. It accepts a local PDF, extracts page text with heuristics, generates lightweight metadata, and writes JSONL output compatible with `docs/schema/page-metadata.json` (subset of fields).

> Prefer a UI? Head to `/workflow/basic` in the Next.js app to upload a PDF and visualize the same workflow without dropping into the terminal.

## Prerequisites
- Node.js 18+
- Install dependencies: `npm install` (fetches `pdf-parse`).
- (Optional) Set `ANTHROPIC_API_KEY` to enable the Claude-powered Page Intelligence agent. Without it the workflow falls back to heuristics.

## Run the workflow
```
npm run workflow:basic -- --pdf ./samples/algebra.pdf --book-id algebra-1
```

### Arguments
- `--pdf` (required): Path to the textbook PDF.
- `--book-id` (optional): Identifier used for output directories. Defaults to the filename slug.
- `--output` (optional): Custom directory for generated artifacts (default `out/<book-id>`).
- `ANTHROPIC_API_KEY` (env): Claude API key for generating rich metadata via the Page Intelligence agent.

## Output
- `out/<book-id>/page-metadata.jsonl`: Page-level records.
- `out/<book-id>/audit/summary.json`: Run summary (page count, checksum, timestamp).

Example JSONL record (abridged):
```json
{
  "book_id": "algebra-1",
  "page_number": 1,
  "summary": "Introductory text …",
  "overview": {
    "key_points": ["Students investigate real-world proportional reasoning", "Contest context motivates modeling"],
    "learning_focus": "Students will explain the modeling scenario and identify needed information.",
    "teacher_guidance": "Use the scenario to spark discussion before assigning calculations."
  },
  "topics": [{"label": "math.algebra", "display_name": "algebra", "confidence": 0.6, "evidence": "Keyword frequency signal for “algebra”."}],
  "instructional": {"grade_band": "6-8", "age_range": {"min": 11, "max": 14, "confidence": 0.65}, …},
  "instructional_objectives": [{"description": "Students will be able to explain the modeling context…", "confidence": 0.55, …}],
  "standards": [{"standard_id": "CCSS.MATH.CONTENT.8.EE.C.7", "alignment_type": "primary", "alignment_confidence": 0.7, …}],
  "assessment_profile": {"purpose": "informal", "question_summary": [{"question_type": "other", "count": 3}], "confidence": 0.55},
  "instructional_strategy": {"primary": "reference", "supporting": ["guided_practice"], …},
  "differentiation_supports": [],
  "supplementary_resources": [{"type": "worksheet", "description": "Worksheet referenced on page.", "availability": "included"}],
  "vocabulary_terms": [{"term": "modeling", "complexity": "grade_level", "confidence": 0.45}],
  "equity_accessibility_flags": [{"category": "technology_requirement", "severity": "low", "description": "Page references online platform.", …}],
  "assets": {"items": [], "assessment": {"has_assessment": true, "items": []}},
  "confidence_profile": {"overall": 0.54, "topics_mean": 0.6, …}
}
```

## Limitations
- Heuristic-only; no Claude Agent SDK integration yet.
- Standards mapping uses a small built-in lookup.
- Assets detection relies on keywords; no layout/image parsing.
- QA always approves unless parsing fails.

This script provides an end-to-end skeleton so you can iterate toward SDK-backed agents without waiting on infrastructure.
