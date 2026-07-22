# Vanilla Package Instructions

## Operating Boundary

- This package is framework-independent and has no runtime dependencies.
- Read the root `../../AGENTS.md`, `../../docs/codex/engineering-rules.md`, and
  `../../docs/codex/frontend-architecture.md` before changing package code.
- Read the relevant file under this package's `docs/` when changing a documented component contract.
- Use `../../.agents/skills/implement-frontend-feature` for implementation work.

## Critical Invariants

- Use light DOM and browser APIs; do not add React, a renderer, Virtual DOM, or Shadow DOM.
- Do not auto-register elements from individual component or package-root entrypoints.
- Keep every `define*` function idempotent and safe to call outside a browser.
- Preserve authored nodes unless the component explicitly owns them.
- Preserve native form semantics, reset, validation, cancellation, and event behavior.
- Keep public entrypoints independently importable and tree-shakeable.
- Keep Popover API and CSS Anchor Positioning as progressive enhancements with supported fallbacks.
- Preserve the `alt-*` element, event, attribute, selector, token, and cascade-layer contracts.

## Architecture

- Custom elements in `src/components/` own rendering and component lifecycle.
- Controllers in `src/controllers/` own reusable behavior without taking over rendering.
- Shared element infrastructure belongs in `src/core/`.
- Component styling belongs in the corresponding file under `src/styles/components/`.
- `src/styles/core.scss`, `theme.scss`, and `default.scss` must remain valid independent entrypoints.
- `src/define-all.ts` is the only convenience entrypoint that registers the complete element set.
- Keep one custom-element class per component implementation file.
- Clean up listeners, observers, timers, generated nodes, and open overlays on disconnect.
- Guard browser globals at import time and verify SSR-safe entrypoints when public modules change.

## Public Changes

- Update `package.json` exports and the relevant source barrel for new public modules.
- Update README, component docs, demo catalog states, and tests when a public contract changes.
- Add icons through the existing tree-shakeable icon system rather than fonts or opaque assets.
- Do not edit or commit `dist/` or `demo-dist/` output.

## Validation

- Run `npm run verify:vanilla` for every package change.
- Run `npm run test:browser --workspace @atlanticrev/atl-ui-vanilla` for interaction, accessibility,
  layout, focus, dismissal, or visual changes.
- Run `npm run demo:build --workspace @atlanticrev/atl-ui-vanilla` for catalog or deployment changes.
- Add regression coverage at the smallest reliable layer and report any skipped browser engines or checks.
