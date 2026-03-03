# Page Metadata Schema

This directory holds the canonical schema for page-level metadata emitted by the Claude-powered labeling pipeline.

## Files
- `page-metadata.json` — JSON Schema (Draft 07) describing required and optional fields for each page record. This is consumed by the Quality Gate agent and any downstream validation tooling.

## Consumption Pattern
1. Ingestion + analysis agents write intermediate artifacts to `data/<book-id>/pages/`.
2. Coordinator assembles draft page metadata objects and stores them in a staging area.
3. Quality Gate validates the object against `page-metadata.json` before appending to `out/<book-id>/page-metadata.jsonl`.
4. Downstream services (search, analytics) import the JSONL after signature verification.

## Field Groups
- **Identity**: `book_id`, `page_number`, `source_checksum`, `generated_at`, `agent_versions`.
- **Overview & Summary**: `summary`, `overview` (key points, learning focus, teacher guidance), and `topics`.
- **Instructional Profile**: grade/age, pedagogy type, Bloom level, primary skill with confidences + rationales.
- **Objectives & Standards**: instructional objectives tied to standards plus structured alignments with evidence and review actions.
- **Assessment & Strategy**: assessment profile, instructional strategy, differentiation supports, supplementary resources.
- **Vocabulary & Equity**: vocabulary list with complexity, equity/accessibility flags, and resource requirements.
- **Assets & Confidence**: detailed assets block, aggregated confidence metrics, QA review status, violation log.

## Versioning & Change Control
- Update schema using semantic version bumps in `agent_versions` reference.
- Breaking changes require: (a) migration plan for stored data, (b) update to Quality Gate prompts, (c) communication to downstream consumers.
- Track historical revisions in git and tag releases in tandem with deployable coordinator versions.

## Testing Guidance
- Add unit tests (e.g., AJV) that validate representative records per subject/grade.
- Include regression fixtures for known edge cases (blank pages, multi-standard alignments, assessment-heavy pages).

## Open Questions
- Should we add optional `reading_level` metrics from external classifiers?
- Do we need to capture copyright notices per page for compliance reporting?
