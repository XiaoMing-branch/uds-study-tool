## Decisions

### 2026-05-19: Task 1 completed, restarting Task 2
- Background task for Task 2 was lost during session compaction
- Restarting Task 2 fresh with full context
- Task 1 verification: README.md content fully verified, git diff confirms only README.md changed

### Guardrails Active
- Do NOT modify HTML source files (README + docs only)
- Do NOT fix bugs found during review
- PDF parsing limited to ISO 14229-1 key tables only
- Missing 34+ standard services = scope decision, NOT code defect
