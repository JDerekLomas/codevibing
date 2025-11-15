# Page Analysis Agents

## Overview
> Legacy design note: The Page Intelligence agent now covers the responsibilities of the individual analyzers below. Keep these specs if you want to split duties across multiple smaller agents for experimentation or fallback modes.

Three specialized agents operate on each page artifact bundle to capture complementary metadata. The coordinator spawns them with read-only access to the page directory and shared taxonomy references.

## Common Inputs
- `page.txt`, `page.md`, optional `layout.json`, rendered `page.png`.
- Shared context snippets from `CLAUDE.md` (glossary, tone guidance, SME notes).
- Coordinator payload including `book_id`, `page_number`, prior page summaries for continuity.

---

## Topic Summarizer
### Mission
Distill the central learning objective(s) into concise topics and a 2–3 sentence summary tailored for catalog search.

### System Prompt Draft
```
You are the Topic Summarizer. Produce:
1. `summary`: two sentences max describing the instructional focus.
2. `topics`: 3-5 key concept labels using the canonical taxonomy.
3. `keywords`: optional supporting terms (≤8) for search indexing.
Return JSON only. Include confidence 0-1 per topic.
Avoid inferring beyond the page; cite nearby text snippets when uncertain.
```

### Outputs
```
{
  "summary": "...",
  "topics": [{"label": "Fractions", "confidence": 0.82, "evidence": "text span"}, ...],
  "keywords": ["mixed numbers", "visual fraction model"]
}
```

### Quality Checks
- Topics align with taxonomy slugs defined in `taxonomy.json`.
- Confidence <0.6 triggers QA annotation request.

---

## Instructional Profiler
### Mission
Identify how the page teaches (lecture, guided practice, assessment), the intended learner profile, and Bloom-level style cues.

### System Prompt Draft
```
You are the Instructional Profiler. Inspect prose + layout cues to fill fields:
- `grade_band`: choose from K-2, 3-5, 6-8, 9-12, higher-ed.
- `primary_skill`: taxonomy-aligned skill focus.
- `pedagogy_type`: e.g., "worked_example", "guided_practice", "assessment", "reference".
- `bloom_level`: remember/understand/apply/analyze/evaluate/create (choose best fit).
- `age_range`: min/max age estimate.
Provide rationale strings and confidence per field.
Return JSON only.
```

### Outputs
```
{
  "grade_band": {"value": "6-8", "confidence": 0.7, "rationale": "Mentions middle school"},
  "age_range": {"min": 11, "max": 14, "confidence": 0.65},
  "pedagogy_type": {"value": "guided_practice", "confidence": 0.8, "rationale": "Step-by-step questions"},
  "bloom_level": {"value": "apply", "confidence": 0.6},
  "primary_skill": {"label": "Solving linear equations", "confidence": 0.74}
}
```

### Quality Checks
- Age and grade band must be coherent (e.g., 11-14 ↔ 6-8).
- Low-confidence results flagged for QA review.

---

## Asset & Pedagogy Spotter
### Mission
Catalog page assets (figures, tables, exercises) and note pedagogical signals that help downstream UX (e.g., presence of lab, project, multimedia callout).

### System Prompt Draft
```
You are the Asset Spotter. Inspect layout + text cues to return:
- `assets`: list items with `type`, `description`, optional `bounding_box`.
- `assessment_items`: count + type (multiple choice, short answer, open response).
- `supporting_media`: urls or references if external media is cited.
- `warnings`: list of issues (e.g., illegible image, missing caption).
Return JSON only.
```

### Outputs
```
{
  "assets": [
    {"type": "diagram", "description": "Fraction circle model", "bounding_box": [120, 210, 340, 420]}
  ],
  "assessment_items": [{"type": "short_answer", "count": 3}],
  "supporting_media": [],
  "warnings": []
}
```

### Quality Checks
- Bounding boxes optional; require when layout data available.
- Warn when images detected but text lacks alt/description.

## Escalation Triggers (All Agents)
- Taxonomy lookup fails.
- Page missing text (blank, cover) – return structured `page_status` for coordinator.
- Confidence below quorum threshold (configurable).
