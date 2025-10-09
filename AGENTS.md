# AGENTS.md

## Scope
These instructions apply to the whole SagoraAI repository unless a nested `AGENTS.md` overrides them.

## Product context
- The app implements the Sagora cockpit for SMEs. Use `SAGORA_APP_CODEX.md` as the authoritative product spec and backlog when you need business context or acceptance criteria.
- `docs/roadmap.md` is the current north-star execution guide. Keep new workstreams, architectural decisions, and prioritisation aligned with this document and update it when the strategy evolves.
- `docs/features/registry.md` tracks live features. Keep it aligned with UI and API changes (update status, owners, KPI snippets) whenever you ship or deprecate a feature that it references.
- `SAGORA_VERIFICATION_TESTS.md` captures the holistic verification plan. Update it when you add meaningful tests or change QA scope.

## Working conventions
- Language: TypeScript/React (Next.js 13+ with the App Router). Styling is TailwindCSS.
- Follow ESLint/Prettier defaults already configured in the repo. Do not introduce ad-hoc style rules.
- Prefer small, focused PRs and conventional commit messages. Document business-facing changes in `/docs` when appropriate.

## Testing guidance
- Front-end unit/integration tests should run with `npm test`. End-to-end coverage lives under `tests/` and runs with Playwright.
- When adding or modifying code, run the most specific test command you can. Mention executed commands in the final summary.

## Documentation guidance
- Keep Markdown sections short and scannable (headings, tables, bullet lists). Mention generation commands where relevant.
- When you touch multiple knowledge sources (e.g., CODEX + feature registry), cross-reference them through Markdown links.

