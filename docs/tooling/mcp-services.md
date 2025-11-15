# MCP Services & Tooling Inventory

| Service Name | Purpose | Implementation Notes | Owning Team |
| --- | --- | --- | --- |
| `pdf_parser` | Extract vector text, layout JSON, render page images | Wraps `pypdf` + `pdfplumber`; fallback to OCR when vector text missing. Outputs page bundle to working dir. | ML Platform |
| `ocr_service` | OCR rasterized pages | Tesseract-based container with language packs. Returns text + confidence scores. | ML Platform |
| `layout_classifier` | Identify structural regions (title, sidebar, body) | Optional model for improved pedagogy detection; consumes rendered page image. | Research |
| `standards_search` | Semantic search over standards corpus | Uses embeddings (OpenSearch/KNN). Input topic string, returns ranked standard IDs. | Curriculum Tech |
| `standards_lookup` | Fetch standard metadata | REST wrapper exposing description, grade span, parent path. | Curriculum Tech |
| `taxonomy_lookup` | Resolve topic slugs + hierarchy | Serves canonical taxonomy JSON with aliases, grade bands, related skills. | Product Ops |
| `equity_rubric` | Evaluate accessibility/equity cues | Applies rubric rules to text snippets (reading level, tech requirements, cultural markers). | Research |
| `assessment_classifier` | Categorize assessment items | Classifies question intent (formative, summative) and item type with confidence. | Applied ML |
| `schema_validator` | Validate JSON payloads | AJV CLI or service reading schemas from repo. Used by Quality Gate. | Platform Tooling |
| `eval_hooks` | Run heuristic checks (reading level, toxicity, keyword coverage) | Optional, triggered post-analysis; returns pass/fail + score. | Applied ML |

## Integration Guidelines
- Each MCP server requires entry in coordinator config with transport details (stdio, HTTP, socket).
- All services must log tool invocations for auditing; include `book_id`, `page_number`, agent name.
- Enforce rate limits per agent to avoid overloading shared services.
- Define fallback behavior when any service unavailable (e.g., degrade gracefully or escalate).

## Secrets & Access
- API keys stored in secrets manager; agents receive scoped environment variables.
- Ensure OCR + parser containers operate within same sandbox to avoid network egress.
- Standards services may involve licensing; add entitlement checks before allowing alignment calls.

## Roadmap Additions
- `image_captioning` for generating alt text automatically.
- `ner_highlights` to extract named entities for metadata enrichment.
- `plagiarism_check` to ensure generated summaries do not copy verbatim text beyond allowed threshold.
