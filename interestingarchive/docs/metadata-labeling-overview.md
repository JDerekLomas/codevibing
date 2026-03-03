# Textbook Metadata Labeling Initiative

## Purpose
Create a reliable, semi-autonomous pipeline that assigns rich instructional metadata to textbook pages. The system should scale across curricula, surface what each page teaches, and anchor content to established standards to power discovery, analytics, and personalization.

## Scope (MVP)
- Input: PDF textbooks (vector PDFs preferred, OCR fallback) and optional catalog metadata.
- Output: Page-level JSON lines matching `docs/schema/page-metadata.json` stored per textbook.
- Supported metadata: summary, key points, objectives, standards alignment, instructional strategy, assessment profile, differentiation supports, equity/accessibility flags, vocabulary, notable assets, confidence scores.
- Users: internal curriculum team, downstream search/recommendation services, evaluation dashboards.
- Exclusions: automated remediation authoring, answer key extraction, licensing classification (capture as future work).

## Success Criteria
- ≥95% schema compliance validated by automated tests and QA agent checks.
- Human spot-check agreement ≥80% on primary topic + grade band across sampled pages.
- Processing throughput ≥200 pages/hour on reference hardware with parallel agents.
- End-user search latency improvement ≥25% after integrating labeled data.

## Key Stakeholders
- **Product**: defines taxonomy priorities, success metrics.
- **Curriculum SMEs**: validate standards mapping, tune heuristics.
- **ML/Infra**: maintain MCP services (PDF parsing, embeddings, knowledge bases).
- **Compliance**: ensures data handling aligns with licensing agreements.

## Assumptions
- Source PDFs are accessible within sandboxed storage and can be mirrored to working directories.
- Claude Agent SDK has access to required MCP servers and Claude API key via secured secrets management.
- Standards taxonomy (e.g., CCSS, NGSS) delivered as versioned dataset or API with stable identifiers.

## Open Questions
- What priority order should the system use when multiple standards map to the same topic?
- Are there privacy constraints on student-facing examples that impact storage of extracted snippets?
- Who owns manual override workflows when agents disagree or confidence < threshold?
- Required cadence for refreshing standards/ontology updates?

## Next Milestones
1. Approve system architecture draft.
2. Build ingestion prototype on a single textbook; generate sample metadata bundle.
3. Define evaluation rubric with curriculum SMEs; integrate into QA agent hooks.
4. Plan deployment environment (local, cloud, hybrid) and access controls for stored labels.
