# Frontend Architecture

This document expands the frontend rules for the React component library and the framework-independent
vanilla package in this workspace.

## When To Read This

- Read this before changing components, forms, hooks, styles, icons, stories, demos, tests, or public exports.
- For `packages/atl-ui-vanilla/`, read the package-local `AGENTS.md` after this document.
- Use `docs/codex/engineering-rules.md` for shared change discipline and completion criteria.

## Stack And Package Boundaries

- The root package is React + TypeScript, bundled as ESM with tsup.
- The vanilla workspace is TypeScript + browser APIs + light-DOM custom elements with no runtime dependencies.
- Sass builds the `core.css`, `theme.css`, and `default.css` entrypoints for both packages.
- Biome is the only linting and formatting system; do not add ESLint, Prettier, or Stylelint.
- Vitest covers unit and component behavior. Playwright covers vanilla browser, accessibility, and visual flows.
- Storybook is the React catalog. The vanilla package uses its dependency-free Vite demo and catalog.
- Neither package is a Next.js application. Do not introduce routing, server-component, database, or app-level
  architecture into this library without a concrete package requirement.

## Senior Frontend Decision-Making

- Decide the affected package, public contract, state ownership, rendering boundary, and styling boundary
  before choosing files or abstractions.
- Treat each component API as a consumer contract, not only as an internal implementation detail.
- Prefer co-located component code until a stable reusable contract emerges.
- Optimize for accessible interactions, predictable state, stable layout, and small tree-shakeable output.
- Prefer explicit data mapping and narrow props or properties over clever abstraction.
- Hooks, controllers, helpers, and shared modules are tools, not mandatory layers.
- Minimize future change cost through local edits, small public surfaces, and consistent package behavior.

## Repository Structure

### React package

- `src/components/<component>/` owns a React component, types, tests, stories, and component-local helpers.
- `src/components/theme/` owns React theme implementations split by component.
- `src/forms/` owns the headless form store, React bindings, runtime rendering, and adapters.
- `src/hooks/` contains stable hooks reused across components.
- `src/icons/` contains typed React icon components and icon-local styles.
- `src/lib/` and `src/shared/` are for narrow utilities and stable shared contracts, not miscellaneous code.
- `src/index.ts` and `src/forms/index.ts` are deliberate public entrypoints.

### Vanilla package

- `packages/atl-ui-vanilla/src/components/` owns light-DOM custom elements.
- `packages/atl-ui-vanilla/src/controllers/` owns reusable browser behavior without rendering ownership.
- `packages/atl-ui-vanilla/src/core/` owns shared element infrastructure.
- `packages/atl-ui-vanilla/src/styles/` owns its CSS layers, recipes, tokens, and component styles.
- `packages/atl-ui-vanilla/demo/` and `tests/` are verification surfaces, not runtime dependencies.
- Package exports are explicit and must remain tree-shakeable and safe to import during SSR.

## Component Architecture

- Keep feature-local behavior close to the component that owns it.
- Extract logic when it is reused, materially improves readability, or owns a real stateful lifecycle.
- Do not force every React component through `component -> hook -> service`.
- Do not force every custom element through a controller when the behavior is local and simple.
- Prefer module-local private constants and helpers, exporting only the symbols consumers need.
- Keep each independent component or functional block in its own folder.
- Separate UI component, types, styles, tests, stories, and constants when those parts exist.
- Allow only one UI component or custom-element class per implementation file.
- Keep public APIs small and prefer composition over boolean-prop or property explosion.
- Make invalid combinations impossible or obvious through types, validation, or documented constraints.
- Avoid deep nesting, long prop chains, generic managers, and parallel component implementations.

## React State And Effects

- Keep state local unless multiple consumers require a shared owner.
- Keep unrelated state separate; use object state or `useReducer` only when values transition together.
- Do not duplicate derived state or synchronize props into state without a clear reason.
- Do not mix controlled and uncontrolled input behavior.
- Use effects only to synchronize with external systems, browser APIs, or owned subscriptions.
- Keep effect dependencies complete and clean up listeners, timers, observers, and in-flight work.
- Do not pass an async function directly to `useEffect`.
- Keep rendering deterministic and free from hidden side effects.

## Vanilla State And Lifecycle

- Keep authored light-DOM content intact unless a component explicitly owns that node.
- Make upgrade, connect, disconnect, attribute reflection, and form reset behavior deterministic.
- Clean up listeners, observers, timers, popovers, and generated nodes on disconnect.
- Keep `define*` functions idempotent and individual entrypoint imports free from auto-registration.
- Guard browser globals so package imports and registration calls remain safe outside a browser.
- Use platform APIs progressively and preserve tested fallbacks where the browser baseline requires them.
- Keep custom events, cancellation semantics, properties, attributes, and native form behavior explicit.

## Public API And Distribution

- Update the relevant `package.json` export map when adding a public entrypoint.
- Export public React symbols through `src/index.ts` or `src/forms/index.ts`; avoid accidental deep imports.
- Keep vanilla entrypoints independently importable and free from unrelated registrations or code paths.
- Treat generated declarations as part of build verification, but do not edit or commit `dist/` output.
- Keep React 18 and React 19 compatibility for the root package.
- Preserve the vanilla package's zero-runtime-dependency contract.
- Consider bundle size and tree shaking before adding shared imports or side effects.
- Update README examples and package docs when consumer usage changes.

## Styling And Theming

- Keep structural styles in `core.css`, default tokens in `theme.css`, and compose both in `default.css`.
- Keep the three entrypoints independently valid; do not make core styles depend on the default theme.
- Use semantic CSS custom properties for public theming contracts.
- Treat documented tokens, component variables, selectors, data attributes, and cascade layers as public API.
- Keep React component theme files split by component and imported only through the theme entrypoint.
- Keep vanilla styles within the documented cascade-layer order.
- Prefer shallow SCSS nesting and avoid specificity escalation or selector pyramids.
- Use existing naming conventions: `.atl-*` for React styles and `.alt-*` for vanilla styles.
- Do not introduce CSS Modules for package-level component styles; these packages intentionally ship stable
  global selectors.
- Define interaction states consistently: hover, focus-visible or focus-within, active, disabled, readonly,
  invalid, loading, and open where applicable.
- Prefer design tokens over repeated literal colors, spacing, radius, shadows, z-index, or typography.

## Icons And Assets

- Keep React icons as typed components in `src/icons/` and export them intentionally.
- Keep vanilla icons tree-shakeable and independent from icon fonts.
- Decorative icons must be hidden from assistive technology; meaningful icons need an accessible name.
- Do not add oversized assets or runtime asset dependencies for simple vector UI.

## Accessibility And Forms

- Use native semantics first and ARIA only when necessary and correct.
- Every interactive component must support keyboard operation, visible focus, and sensible tab order.
- Form controls need programmatic labels, descriptions, validation state, and predictable reset behavior.
- Popups, dialogs, listboxes, tabs, and menus must preserve their documented focus and dismissal behavior.
- Modals and dialogs must trap and restore focus where the interaction model requires it.
- Do not use a plain `div` as an interactive control when a native element can express the behavior.
- Expose loading, empty, error, retry, success, disabled, readonly, and submitting states when relevant.
- Verify accessibility behavior in the package's real rendered environment, not only through static markup.

## TypeScript And Code Style

- Keep TypeScript strict and avoid `any`; use `unknown` plus narrowing at untyped boundaries.
- Give exported functions, component props, custom-element properties, events, and public helpers explicit types.
- Prefer `type` aliases unless an existing local convention requires an interface.
- Use discriminated unions when a component mode or state machine has meaningful exclusive states.
- Avoid advanced generic stacks when a named concrete type is clearer.
- Extract magic values into named constants when they encode behavior or policy.
- Use kebab-case file and folder names and PascalCase React component names.
- Follow local conventions for arrow functions versus declarations.
- Inline callbacks are acceptable when short and clearer than indirection.
- Extract callbacks when reused, non-trivial, or when measured referential stability matters.
- Keep object and array formatting aligned with the configured Biome rules.

## Rendering And Performance

- Use stable keys for lists that can change or reorder.
- Avoid heavy computations during rendering and add memoization only when justified.
- Preserve prop stability where it affects expensive child trees or external components.
- Keep package imports tree-shakeable and avoid side effects outside explicit registration entrypoints.
- Prefer native browser APIs over small dependencies when behavior and compatibility remain clear.
- Keep DOM mutations bounded, intentional, and owned by the relevant vanilla component.

## Testing Strategy

- Test observable behavior rather than implementation structure.
- Add React component tests for important interaction, focus, forms, and validation flows.
- Add vanilla unit tests for lifecycle, events, form association, controllers, and SSR-safe imports.
- Add Playwright coverage for browser-specific behavior, keyboard flows, accessibility, layout, and visuals.
- Use stories or catalog states for meaningful variants and edge states.
- Mock only real boundaries such as time, browser APIs unavailable in jsdom, network, or randomness.
- Keep tests deterministic across supported browser engines.
- Prefer the smallest test layer that reliably catches the regression.

## Documentation And Examples

- Update the root README for React package setup, exports, and public behavior.
- Update `packages/atl-ui-vanilla/README.md` and its `docs/` for vanilla public contracts.
- Keep stories and demo examples aligned with supported APIs and state combinations.
- Document accessibility behavior and non-obvious constraints when misuse would be easy.
- Update release instructions or configuration examples when commands or packaging change.

## Validation Matrix

### React changes

- `npm run lint`
- `npm run typecheck`
- `npx vitest run src`
- `npm run build`
- `npm run build-storybook` when stories or catalog integration change

### Vanilla changes

- `npm run verify:vanilla`
- `npm run test:browser --workspace @atlanticrev/atl-ui-vanilla` for browser-facing changes
- `npm run demo:build --workspace @atlanticrev/atl-ui-vanilla` for catalog or deployment changes

### Cross-package changes

- Run both validation sets.
- Verify whether parity, documentation, exports, and versioning must change in both packages.

## Final Checklist

- the affected package and public contract are explicit
- component APIs are narrow, typed, and hard to misuse
- no unnecessary dependency or runtime side effect was added
- public exports and CSS entrypoints remain correct
- accessibility, keyboard, focus, and form behavior were considered
- interaction states and theme behavior are consistent
- tests cover the behavior at the appropriate layer
- documentation, stories, and examples match the implementation
- relevant build artifacts compile without committing generated output
