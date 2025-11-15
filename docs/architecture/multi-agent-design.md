# Multi-Agent System Design

## High-Level Flow
1. **Coordinator agent** receives textbook ingestion request, seeds shared context (`CLAUDE.md`) with curriculum + taxonomy details.
2. Coordinator dispatches an **Ingestion agent** to extract per-page artifacts (text, images, structure) into `data/<book-id>/pages/`.
3. For each page bundle, coordinator invokes the **Page Intelligence agent** to produce the full metadata record (summary, objectives, standards, assessment, equity, etc.) matching `page-metadata.json`.
4. Resulting JSON optionally flows through the **Alignment Mapper** to explode standards/objectives into normalized tables for analytics.
5. Aggregated metadata passes through a **Quality gate agent** that enforces schema, confidence thresholds, and business rules.
6. Approved metadata is persisted (JSONL) and indexed; failures loop back with remediation notes.

## Component Overview

| Component | Responsibilities | Inputs | Outputs |
| --- | --- | --- | --- |
| Coordinator | Orchestration, permission scoping, shared memory updates | Ingestion request, project config | Agent prompts, run log, manifests |
| Ingestion agent | PDF parsing, OCR fallback, chunking, artifact storage | Textbook file, parsing tools | Page directories with text, images, layout metadata |
| Page Intelligence agent | Produce comprehensive page metadata (summary, objectives, standards, equity, vocabulary, assets) | Page artifacts, taxonomy + standards MCP | JSON record conforming to `page-metadata.json` |
| Alignment mapper | Normalize standards/objectives/equity rows | Page Intelligence JSON | Flattened tables, warnings for inconsistencies |
| Quality gate | Validate schema, run QA hooks, request retries | Aggregated metadata bundle | Approved JSON record or remediation ticket |

## Storage & State
- **Working directory**: `data/<book-id>/` containing `pages/<page-id>/` (text, markdown, assets) and `logs/`.
- **Shared context**: `CLAUDE.md` at project root stores mission, taxonomy definitions, evaluation rubric.
- **Outputs**: `out/<book-id>/page-metadata.jsonl` plus `out/<book-id>/audit/` for QA reports.

## Tooling & MCP Integration
- PDF parsing MCP (vector text, layout, OCR).
- Embedding search MCP keyed on standards corpus.
- Knowledge API MCP for standards metadata (descriptions, grade levels).
- Optional evaluation MCP running heuristics/classifiers for reading level or Bloom tagging.

## Permissions Strategy
- Ingestion agent granted filesystem + parser tools only.
- Page analyzers limited to read-only page artifacts + domain MCP servers.
- Standards mapper allowed to query ontology MCP, denied filesystem writes.
- Quality gate permitted to patch metadata records and update remediation logs, cannot run shell beyond validation scripts.

## Failure Handling
- Coordinator monitors tool errors; retries ingestion per page with exponential backoff.
- Quality gate emits remediation tickets (`out/<book-id>/audit/failed/<page-id>.json`) with cause and suggested follow-up.
- Manual escalation path: flagged pages added to `manual-review/` queue for SME intervention.

## Scaling Considerations
- Coordinator batches pages and parallelizes analyzer agents (configurable concurrency).
- Long-running standards queries handled via background tasks + streaming responses.
- Checkpointing enabled before each agent modifies shared artifacts; QA agent can rewind to restore state if downstream validation fails.
