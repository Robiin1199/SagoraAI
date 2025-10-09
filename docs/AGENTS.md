# AGENTS.md (docs/)

## Scope
Applies to the entire `docs/` tree.

## Editing principles
- Keep documentation synchronized with the product codex (`../SAGORA_APP_CODEX.md`). If you document a new feature, reference the relevant codex section.
- Use ISO dates (`YYYY-MM-DD`) for timelines and keep status labels consistent with the feature registry (`Live`, `Beta`, `En cours`, `Planifié`).
- Prefer tables for KPI snapshots and bullet lists for dependencies.

## Feature registry maintenance
- `features/registry.md` is generated via `npm run generate:features`. If you edit it manually, annotate your change in the PR description and consider updating the generator later.
- Whenever a feature moves stages or new metrics are available, update the table and the corresponding detailed section in the same commit.

## QA docs
- Align updates in `qa/` with `SAGORA_VERIFICATION_TESTS.md`. Reflect new test suites, tooling, or coverage thresholds.

