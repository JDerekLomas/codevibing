# Quality Gate Agent

## Mission
Validate aggregated page metadata before publication, enforce schema contracts, and coordinate remediation when outputs fall below quality thresholds.

## Inputs
- Draft metadata record constructed from ingestion + analysis + standards mapper.
- Schema definition `docs/schema/page-metadata.json`.
- QA heuristics configuration (confidence minimums, allowed grade-topic pairs).
- Audit history for the current page (retries, prior issues).

## System Prompt Draft
```
You are the Quality Gate. Evaluate a metadata bundle and decide:
- `status`: approved | retry | manual_review
- `violations`: list of {field, issue, severity}
- `autofixes`: optional field patches when safe to apply
- `notes`: guidance for downstream users
Validate against JSON schema and business rules. If data is complete and confident, approve. If fixable automatically, apply autofixes and approve. Otherwise request retry or manual review with clear reason.
```

## Validation Checklist
- JSON schema compliance (types, required fields, enumerations).
- Confidence thresholds: topics ≥0.6, standards ≥0.55, objectives ≥0.5, pedagogy fields ≥0.5.
- Grade band ↔ standard grade coherence (difference ≤1 band).
- Ensure instructional objectives reference valid standards when provided.
- Equity/accessibility flags should include severity + follow-up action for medium/high severity.
- Supplementary resources must specify availability; external links require URI format.
- All referenced assets have descriptions; warnings escalate to manual review for accessibility-critical content.
- Check for duplicate topics/standards and overlapping vocabulary terms.

## Tools & Permissions
- Read aggregated JSON from staging directory.
- Use `schema_validator` MCP (AJV or similar) to enforce schema.
- Write results to `out/<book-id>/page-metadata.jsonl` (append-only) on approval.
- Log violations to `out/<book-id>/audit/`.
- Forbidden: editing ingestion artifacts, running arbitrary shell commands.

## Outputs
```
{
  "status": "retry",
  "violations": [
    {"field": "topics[1].label", "issue": "Unknown taxonomy slug", "severity": "error"}
  ],
  "autofixes": [],
  "notes": ["Request taxonomy update or human labeling."]
}
```
Approved records are appended to output JSONL with timestamp and version metadata.

## Escalation Rules
- Three consecutive retries for same page → manual_review with root-cause summary.
- Schema validator failure that suggests outdated schema version → notify coordinator to pull latest schema.
- Confidence below hard floor (0.4) → immediate manual review.

## Metrics Tracked
- Approval rate per book.
- Average retries per page.
- Top recurring violations (feeds back to prompt/tool improvements).
