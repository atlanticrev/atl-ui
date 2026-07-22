---
name: architecture-check
description: Check a change or plan against the atl-ui repository architecture and public package contracts. Use when reviewing a design, validating a refactor, checking cross-package parity, or verifying that code follows the documented React or vanilla boundaries.
---

1. Read the active `AGENTS.md`, the closest package-local `AGENTS.md`, and the matching
   `docs/codex/*.md` files.
2. Identify the affected package and contracts: public exports, types, rendering ownership, state flow,
   styling entrypoints, events, attributes, form behavior, and configuration.
3. Check for architecture drift: speculative abstractions, hidden side effects, mixed responsibilities,
   duplicate implementations, accidental coupling, missing validation, and unintended breaking changes.
4. For cross-package work, decide explicitly whether React and vanilla parity is required.
5. Tie findings to concrete files, observable behavior, and documented rules rather than general opinions.
6. If the change is acceptable, state residual risks and missing validation. Otherwise recommend the
   smallest corrective step that restores alignment.
