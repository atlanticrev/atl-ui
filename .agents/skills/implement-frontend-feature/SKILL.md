---
name: implement-frontend-feature
description: Implement or refactor a component-library feature in atl-ui. Use for React components, headless forms, hooks, Sass themes, stories, vanilla Web Components, controllers, browser interactions, package exports, or frontend architecture decisions.
---

1. Read the active `AGENTS.md`, `docs/codex/frontend-architecture.md`, and the closest package-local
   `AGENTS.md`.
2. Identify the affected package, public API, state owner, rendering owner, CSS layer, and compatibility
   requirements before editing.
3. Reuse existing components, hooks, controllers, browser APIs, tokens, and utilities before adding a new
   abstraction or dependency.
4. Preserve package invariants: React 18/19 compatibility for the root package and zero runtime
   dependencies, light DOM, explicit registration, and SSR-safe imports for the vanilla package.
5. Make accessibility, keyboard, focus, form, loading, disabled, readonly, error, and open states explicit
   when relevant.
6. Update exports, types, styles, tests, stories, demos, and documentation when the consumer contract changes.
7. Run the package-specific validation matrix from `docs/codex/frontend-architecture.md` and report gaps.
