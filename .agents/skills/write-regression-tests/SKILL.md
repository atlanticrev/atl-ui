---
name: write-regression-tests
description: Add or tighten regression coverage for the atl-ui React and vanilla packages. Use when fixing a bug, protecting component behavior, testing forms or controllers, or covering accessibility, keyboard, browser, layout, or visual behavior.
---

1. Read the active `AGENTS.md`, the closest package-local `AGENTS.md`, and the testing sections in
   `docs/codex/frontend-architecture.md`.
2. Identify the observable behavior that must not regress: happy path, edge case, failure mode, public API,
   accessibility contract, or cross-browser interaction.
3. Choose the smallest reliable layer: Vitest for logic or jsdom behavior, React Testing Library for React
   interaction, and Playwright for real-browser, accessibility, layout, focus, or visual behavior.
4. Prefer deterministic assertions over implementation trivia and mock only true external boundaries.
5. Cover the original regression first, then add adjacent edge cases only when they protect meaningful risk.
6. If automation is impractical, document the strongest alternative verification and the remaining gap.
7. Run the relevant focused test and package validation command, then report the result clearly.
