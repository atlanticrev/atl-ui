# Engineering Rules

This document expands the shared rules in the short root `AGENTS.md`. Read it for cross-cutting work,
architecture decisions, or rationale that should not occupy the always-on context.

## How To Use This Document

- Read the active `AGENTS.md` first, then this document and the relevant architecture document.
- Use repository-local skills for repeatable implementation, testing, and review workflows.
- Pair written guidance with machine checks. Enforceable rules belong in Biome, TypeScript, tests, or CI.
- Prefer the closest package command and configuration over a generic command copied from another project.

## File Size And Modularity

- Do not allow large files by accident, but do not split files mechanically.
- Prefer cohesive modules with clear ownership over many tiny files that force navigation.
- Organize code by component, feature, or domain rather than by incidental implementation detail.
- Target up to `120` lines of code for a regular source module when practical.
- Do not exceed roughly `150` lines without a clear reason; split before responsibilities become mixed.
- Keep code lines at or below `120` characters.

## Code Clarity And Patterns

- Keep one clear responsibility per module and function.
- Prefer local, explicit code over speculative abstractions.
- Introduce a pattern only when it makes ownership, control flow, or extension points clearer.
- Do not create wrappers, managers, hooks, controllers, or public extension points "just in case".
- Optimize for maintainers reading the code later, not for cleverness or minimal character count.

## Readability And Transparency

- Make code understandable from top to bottom without requiring hidden context.
- Prefer linear flow: validate, prepare, execute, return.
- Use guard clauses to keep the happy path visible.
- Keep transformations explicit and close to the boundary where data changes shape.
- Move non-obvious transformations into named functions.
- Do not mix orchestration, business rules, rendering, and output formatting in one place.
- Prefer named intermediate values over dense chains, nested ternaries, or complex conditions.
- Make invalid states, edge cases, and failure paths as visible as the happy path.
- Validate invariants at boundaries rather than assuming them in core code.
- Include enough context in errors to explain what failed and why, without exposing sensitive data.
- Keep stable file order: types and constants, main export, then private helpers when local conventions allow.
- A small behavior change should stay local; broad edits are a signal to re-check module boundaries.

## Stability

- Preserve existing behavior unless the task explicitly changes it.
- Treat exported JavaScript, TypeScript types, CSS entrypoints, tokens, selectors, attributes, events, and
  form behavior as consumer-facing contracts.
- Keep side effects explicit, isolated, and safe to repeat where repeatability matters.
- Keep state transitions and invariants in one owned place instead of scattering them across modules.
- Define recoverable and terminal failures intentionally; do not add silent fallback behavior.

## Change Discipline

- Study local patterns before introducing structure or conventions.
- Keep diffs focused and avoid unrelated cleanup.
- Do not mix feature work, refactors, and opportunistic rewrites unless they are tightly coupled.
- Extend a sound existing abstraction before creating a parallel implementation.
- Keep necessary refactors proportional to the problem.
- Preserve backward compatibility unless breaking behavior is explicitly authorized.

## Abstractions And Dependencies

- Prefer the simplest correct, maintainable design.
- Do not introduce an abstraction before it solves a concrete recurring problem.
- Avoid generic helpers or services with unclear ownership.
- Add dependencies only when current code, browser or platform APIs, and existing tooling are insufficient.
- Consider bundle size, tree shaking, maintenance, security, and consumer impact for every dependency.
- Prefer explicit data flow and small interfaces over indirection-heavy designs.

## Public API And Naming

- Keep public interfaces small, explicit, typed, and hard to misuse.
- Name modules and symbols by domain meaning rather than implementation mechanics.
- Avoid vague utility names, overloaded entrypoints, and accidental public exports.
- Prefer plain named module exports over factories that expose public objects with methods and mutable state.
- Keep private constants, state, and helpers module-local.
- If a name needs a long comment, improve the name or structure.

## Testing And Verification

- Add regression coverage for important fixes when practical.
- Verify observable behavior, meaningful edge cases, and expected failure behavior.
- Keep tests deterministic, fast, and readable.
- Mock only true boundaries such as network, filesystem, time, randomness, or external services.
- Test accessibility and keyboard behavior for important interactive components.
- If automation is not practical, record the strongest concrete alternative and the remaining gap.
- Do not add tests that only mirror implementation details.

## Errors, Logging, And Safety

- Never swallow errors silently.
- Surface enough context to diagnose failures without exposing consumer data or secrets.
- Log only at meaningful boundaries and avoid duplicate noise.
- Never log passwords, credentials, tokens, cookies, private keys, or personal data.
- Give external IO explicit validation, limits, timeouts, and failure handling where applicable.
- Prefer failing clearly over continuing with corrupted or unknown state.

## Configuration And Secrets

- Do not hardcode environment-specific, user-specific, or sensitive values.
- Keep configuration in a discoverable source of truth and validate required values early.
- Keep defaults safe and unsurprising.
- Update templates and documentation when configuration changes.

## Maintainability

- Do not leave dead code, commented-out implementations, or abandoned experiments.
- Comments should explain why a constraint or tradeoff exists, not narrate obvious code.
- Keep modules cohesive and split them when unrelated responsibilities accumulate.
- Prefer bounded incremental improvements over broad rewrites.
- Make TODOs specific and actionable.

## Definition Of Done

A change is complete only when:

- the requested behavior works end to end
- existing behavior and public contracts are preserved unless explicitly changed
- critical paths, edge cases, and failure paths were considered
- tests or another meaningful verification method cover the risk
- documentation, stories, examples, or run instructions reflect public behavior changes
- configuration and package exports remain aligned with their source of truth

Do not treat a diff as finished only because it compiles.
