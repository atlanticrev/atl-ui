# Project Instructions

## Operating Model

- Treat this file as the always-on contract for the repository.
- Before changing code, read the matching files under `docs/codex/`, then the closest local `AGENTS.md`,
  and then the relevant skill under `.agents/skills/` when the task follows a repeatable workflow.
- At the start of a new session, briefly state the context files read, the constraints that matter, and the
  validation commands planned before editing.
- Work from the closest package directory when possible so package-local instructions become active.

## Critical Invariants

- Keep solutions explicit, readable, local, and proportionate to the problem.
- Preserve consumer-facing behavior and public exports unless the task explicitly allows a breaking change.
- Keep the React and vanilla packages independently usable; parity changes must be intentional, not assumed.
- Never introduce runtime dependencies into `@atlanticrev/atl-ui-vanilla`.
- Keep errors explicit and never continue from corrupted or unknown state.
- Never log or commit secrets, credentials, tokens, cookies, or sensitive personal data.
- Keep diffs focused and avoid speculative abstractions, unrelated rewrites, or duplicate implementations.
- Add dependencies only when the platform, current tooling, and existing project code are insufficient.

## Context Routing

- Read `docs/codex/engineering-rules.md` for shared engineering rules and completion criteria.
- Read `docs/codex/frontend-architecture.md` for React components, forms, styles, public package contracts,
  accessibility, and frontend testing.
- For work under `packages/atl-ui-vanilla/`, also read its local `AGENTS.md` and the relevant package docs.
- Use `.agents/skills/implement-frontend-feature` for component, form, styling, or package API work.
- Use `.agents/skills/write-regression-tests` when adding or tightening regression coverage.
- Use `.agents/skills/architecture-check` when reviewing a design, refactor, or cross-package boundary.

## Repository Topology

- `src/components/`, `src/forms/`, `src/hooks/`, and `src/icons/` implement the React package.
- `src/components/core.scss`, `theme.scss`, and `default.scss` are the three React CSS entrypoints.
- `packages/atl-ui-vanilla/` is a separate zero-runtime-dependency Web Components package.
- Root `src/index.ts`, `src/forms/index.ts`, and each package `exports` map define public API boundaries.
- Stories and demos are verification surfaces; they must not become hidden production dependencies.

## Definition Of Done

A change is complete only when:

- requested behavior works end to end in every package intentionally affected
- public exports, styling entrypoints, and backward compatibility were considered
- accessibility, keyboard behavior, focus behavior, and relevant UI states were checked
- important happy paths, edge cases, and failure paths have meaningful verification
- documentation, stories, examples, or package exports were updated when the public contract changed
- generated build output is not committed unless the repository explicitly tracks it

Do not treat a diff as complete only because it compiles.

## Validation

- React package baseline: `npm run lint`, `npm run typecheck`, `npx vitest run src`, and `npm run build`.
- Vanilla package baseline: `npm run verify:vanilla`.
- Run `npm run test:browser --workspace @atlanticrev/atl-ui-vanilla` for interaction, accessibility,
  layout, or visual changes in the vanilla package.
- Run `npm run build-storybook` when React story rendering or Storybook integration changes.
- If a required validation is unavailable, blocked, or intentionally skipped, report it explicitly.
- Prefer focused regression coverage for fixes and observable behavior changes.
