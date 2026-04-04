# Forms Module Plan

## Goal

Implement a headless forms module in `src/forms` that:

- does not depend on concrete `Atl*` UI components
- does not use OOP, classes, or view models
- uses a plain object store with subscriptions
- uses a generic resolver contract instead of coupling core to Zod
- supports runtime schema and SDUI flows
- supports dynamic field registration from day one

## Core Principles

1. `core` knows nothing about React JSX, Storybook, Zod, or `AtlInput`.
2. `react` is only an adapter layer over the core store.
3. UI bindings live separately from form state management.
4. Runtime schema / SDUI is a layer above the form core, not inside it.
5. Validation is always resolver-based.
6. Field subscriptions must be selective to avoid rerendering the whole form.

## Target Structure

```text
src/forms/
  index.ts

  core/
    create-form-store.ts
    form-store.types.ts
    field-state.ts
    form-state.ts
    subscriptions.ts
    path.ts
    errors.ts
    registration.ts
    validation.ts
    resolver.ts
    utils.ts

  react/
    form-context.tsx
    use-atl-form.ts
    use-atl-field.ts
    use-atl-watch.ts
    use-atl-form-state.ts
    atl-controller.tsx

  bindings/
    use-atl-input-binding.ts
    use-atl-select-binding.ts
    use-atl-checkbox-binding.ts
    use-atl-radio-binding.ts
    use-atl-switcher-binding.ts
    use-atl-autocomplete-binding.ts

  runtime/
    runtime-schema.types.ts
    normalize-runtime-schema.ts
    field-registry.ts
    atl-runtime-form.tsx
    atl-runtime-field.tsx

  adapters/
    zod-resolver.ts

  __tests__/
    ...
```

## Phases

### Phase 1. Public Contracts

Define V1 contracts before implementation:

- `AtlFormValues`
- `AtlFormErrors`
- `AtlFieldState`
- `AtlFormState`
- `AtlResolver`
- `validateMode`
- `revalidateMode`
- field registration contract
- runtime field schema contract

Outcome:

- stable public API target for `useAtlForm`, `useAtlField`, `useAtlWatch`, `useAtlFormState`
- stable internal state model for store implementation

### Phase 2. Headless Core Store

Build the form core in `src/forms/core` as a plain object store:

- `createFormStore`
- `getValue`
- `setValue`
- `getValues`
- `setError`
- `clearError`
- `markTouched`
- `markDirty`
- `reset`
- `resetField`
- `registerField`
- `unregisterField`
- `subscribeField`
- `subscribeForm`
- `subscribeWatch`

Implementation rules:

- no classes
- no `EventTarget`
- stable object instance
- internal subscriptions via `Map` and `Set`
- no React dependency

### Phase 3. Path and Nested Value System

Add support for nested field names:

- `email`
- `user.email`
- `addresses.0.city`

Utilities:

- `getByPath`
- `setByPath`
- `deleteByPath`
- `hasByPath`
- path normalization

This is mandatory for:

- regular complex forms
- dynamic backend fields
- SDUI
- future field arrays

### Phase 4. Field Metadata

Store field metadata from day one:

- `touched`
- `dirty`
- `error`
- `invalid`
- `registered`
- `mounted`
- `disabled`
- `required`

This prevents API breakage later when adding richer field state.

### Phase 5. Validation Pipeline

Build validation around a generic resolver contract:

- sync resolver support
- async resolver support
- `validateField`
- `validateForm`
- `handleSubmit`
- `validateMode: onSubmit | onBlur | onChange`
- `revalidateMode`

Important:

- core must not depend on Zod
- errors must be normalized by field path

### Phase 6. Resolver Adapters

Keep adapters outside the core:

- `createZodResolver`
- room for `jsonRulesResolver`
- room for custom backend/runtime resolver

This keeps the core flexible for both typed code-first forms and runtime-driven forms.

### Phase 7. React Integration

Implement React layer in `src/forms/react`:

- `AtlFormProvider`
- `useAtlForm`
- `useAtlField`
- `useAtlWatch`
- `useAtlFormState`
- `AtlController`

All hooks must use `useSyncExternalStore` where appropriate.

### Phase 8. DX-First Field API

`useAtlField(name)` should be the primary API for handcrafted forms.

Expected return shape:

- `value`
- `setValue`
- `onBlur`
- `error`
- `invalid`
- `dirty`
- `touched`
- `reset`
- `name`

`AtlController` is a secondary escape hatch, not the default usage model.

### Phase 9. Selective Subscriptions

Implement separate subscriptions for:

- field value
- field meta
- field error
- form state
- watched paths

Goal:

- changing one field should not rerender unrelated fields
- submit state should not force full form rerenders

### Phase 10. Dynamic Registration

Support dynamic fields from the start:

- `registerField(name, config)`
- `unregisterField(name, options)`
- keep/discard strategies for value, error, touched, dirty
- automatic registration in hooks
- explicit registration for runtime renderers

This is required for backend-driven forms and conditional fields.

### Phase 11. Atl Component Bindings

Add headless bindings for existing UI components:

- `useAtlInputBinding`
- `useAtlSelectBinding`
- `useAtlCheckboxBinding`
- `useAtlRadioBinding`
- `useAtlSwitcherBinding`
- `useAtlAutocompleteBinding`

These bindings should map field state to component props such as:

- `value`
- `onChange`
- `onBlur`
- `status`
- `helperText`

### Phase 12. Runtime Schema / SDUI Layer

Create a dedicated runtime layer:

- `RuntimeFieldSchema`
- `RuntimeFormSchema`
- field registry
- schema normalization
- renderer contract

Flow:

1. backend returns runtime schema
2. schema is normalized
3. field type maps to a renderer
4. renderer uses `useAtlField(name)`

The runtime layer must stay optional and separate from normal handcrafted usage.

### Phase 13. Runtime Renderer API

Expose SDUI helpers such as:

- `AtlRuntimeForm`
- `createAtlFieldRegistry`
- `defaultAtlFieldRenderers`

This should be built on top of form-core, not inside it.

### Phase 14. Package Exports

Export forms as a dedicated public surface:

- `@atlanticrev/atl-ui/forms`

Potential later surfaces:

- `@atlanticrev/atl-ui/forms/runtime`
- `@atlanticrev/atl-ui/forms/adapters/zod`

This phase will require updates to:

- `src/forms/index.ts`
- root barrels
- `tsup.config.ts`
- `package.json`

### Phase 15. Test Coverage

Add core tests first:

- path utils
- store updates
- field registration/unregistration
- dirty/touched tracking
- field subscriptions
- watch subscriptions
- sync validation
- async validation
- submit lifecycle

Then React tests:

- `useAtlField`
- `useAtlFormState`
- dynamic mount/unmount flows
- selective rerender behavior

### Phase 16. Stories and Docs

Document real usage, not only toy examples:

- handcrafted login form
- `AtlInput` + `AtlSelect` form
- Zod-backed validation example
- dynamic backend-driven form
- runtime schema renderer demo
- conditional fields
- async validation / submitting flow

## What Must Be in V1

- headless store
- plain object model
- nested paths
- dynamic registration
- resolver contract
- sync and async validation
- React hooks
- bindings to Atl components
- runtime schema base
- SDUI renderer base

## What Should Not Be in V1 Unless Needed

- `useAtlFieldArray`
- wizard engine
- layout engine for SDUI
- full JSON Schema compatibility
- a giant render-prop API as the main path

## What Still Needs To Be Added For A Complete Forms Platform

The current V1 scope is enough to ship and adopt the module, but it is not yet "complete for every case".
To get there, the forms package still needs the following layers.

### 1. Field Arrays and Repeatable Structures

- `useAtlFieldArray`
- append / prepend / insert / remove / move / swap / replace
- stable item keys so reorder does not destroy UI state
- array-aware dirty / touched / error preservation
- nested arrays such as `items.0.variants.2.name`

Without this, many checkout, pricing, onboarding, CMS, and admin forms remain awkward.

### 2. Cross-Field and Dependency-Aware Validation

- field dependencies so one field can trigger validation for another
- cross-field rules like password confirmation, min/max pairs, date ranges
- form-level validation errors not tied to a single field path
- validation strategies for hidden / disabled / unmounted fields
- `validateOnMount` and partial validation entry points

Resolver support exists, but richer dependency-aware orchestration is still needed.

### 3. Async Validation Control

- debounce for expensive async validators
- cancellation / stale result protection
- pending state per field, not only global `isValidating`
- last-request-wins semantics for async field validation
- optional async validation cache for repeated checks

This matters for username uniqueness, remote policy checks, promo codes, and backend-driven constraints.

### 4. Server Error Mapping and Submission Lifecycle

- explicit API for mapping server field errors into form state
- global form error channel separate from field errors
- submit status model beyond `isSubmitting`
- submission cancellation / abort support
- submit retry helpers where appropriate
- success state / last submitted values when needed

Real apps often need more than "valid or invalid".

### 5. Richer Field Metadata and State

- `visited`
- `modifiedSinceSubmit`
- `validated`
- `pending`
- readonly state at field and form level
- hidden / inactive state when schema-driven UI is used

This helps with enterprise-grade UX rules and more advanced form flows.

### 6. Value Transforms and Data Mapping

- `parse` / `format` / `serialize` / `deserialize`
- UI value vs API value mapping
- support for object values, dates, files, numbers, and nullable primitives
- normalization hooks before validation or submit
- support for computed defaults and server-prefilled values

This is required for real integrations where UI values rarely match API DTOs one-to-one.

### 7. Conditional Logic and Derived Fields

- declarative conditional visibility
- enable / disable rules based on other values
- derived fields and calculated values
- controlled reset behavior when conditions change
- explicit policies for preserving hidden field values

This is especially important for SDUI and dynamic backend-driven forms.

### 8. Runtime Schema Maturity

The current runtime layer is only a base. To be production-grade it still needs:

- grouping and section schema
- layout schema for rows / columns / panels / steps
- condition expressions in schema
- async option loading
- remote dictionaries and dependent selects
- schema versioning and normalization pipeline
- safe renderer fallback for unknown field types
- schema-level accessibility metadata

### 9. JSON Schema / External Schema Adapters

- optional JSON Schema adapter
- optional OpenAPI / backend DTO adapter where relevant
- adapter from backend validation format to `AtlFormErrors`
- richer runtime rule resolvers beyond the current simple built-ins

This should remain outside the core, but it is important for long-term interoperability.

### 10. Native and Non-Atl Input Interop

- generic `useAtlControllerBinding` for third-party or custom inputs
- helpers for file inputs
- helpers for date pickers
- helpers for rich text editors
- helpers for masked inputs
- support for native uncontrolled inputs if needed later

The module should stay headless enough to work outside the Atl component set.

### 11. Accessibility Helpers

- field ids and `aria-describedby` helpers
- error summary support
- focus-first-invalid helper on submit
- scrolling to invalid field
- grouped field semantics for checkbox groups / radio groups

This should not be left entirely to consuming apps.

### 12. Devtools and Debugging

- debug snapshot helper
- safe development logger
- optional devtools adapter
- instrumentation hooks for subscription and rerender analysis

Forms become much easier to maintain when state transitions are observable.

### 13. Stronger Performance Guardrails

- selector-based subscriptions if current snapshots become too broad
- benchmarks for large dynamic forms
- tests for thousands of fields and frequent updates
- guarantees around stable callback identity where it matters
- policies for batched updates and atomic state transitions

The current model is good, but it should be proven under heavier load.

### 14. Storybook and Adoption Docs

Beyond the initial examples, a complete module still needs:

- story for field arrays
- story for async validation
- story for server errors
- story for conditional sections
- story for SDUI runtime schema
- migration guide for consumer projects
- best practices and anti-patterns doc

### 15. Future Optional High-Level Helpers

These are not required for the architectural core, but may become valuable later:

- wizard / multi-step helpers
- subform composition helpers
- autosave helpers
- draft persistence
- undo / redo for form edits
- optimistic submit helpers where suitable

These should remain optional and should not pollute the core store.

## Long-Term Readiness Criteria

The forms package can be considered "complete for most real-world scenarios" only when it supports:

1. handcrafted forms
2. runtime / SDUI forms
3. nested objects and arrays
4. sync and async validation
5. cross-field rules
6. server error mapping
7. third-party input integration
8. strong accessibility support
9. predictable performance on large dynamic forms
10. enough docs and examples that consumers do not need to reverse-engineer the API

## Definition of Done

The forms module is considered ready when:

1. a normal handcrafted form can be built with `useAtlForm` and `useAtlField`
2. validation works through a generic resolver
3. Zod can be integrated through an adapter without core coupling
4. dynamic fields can register and unregister safely
5. a simple runtime/backend-driven form can render from schema
6. field updates rerender only subscribed slices, not the whole form
7. tests, stories, and docs cover the main adoption paths
