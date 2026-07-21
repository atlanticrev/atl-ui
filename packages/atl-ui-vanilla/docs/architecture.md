# Vanilla architecture

## Constraints

- No runtime dependencies.
- Importing any entry point must be safe without browser globals.
- Custom elements use autonomous `alt-*` tags and light DOM.
- DOM is created once and updated directly; there is no template engine or reconciliation runtime.
- Native controls remain the semantic and form-participating elements whenever possible.
- Styles use `alt-component__part`, CSS custom properties, and cascade layers.

## Component categories

### Native HTML recipes

Button, card, breadcrumbs, checkbox, radio, switcher, chip, skeleton, and sidebar are semantic HTML with
exported CSS. Feature code owns their content and routing.

### Owned native compounds

Alert, input, file upload, progress, and avatar own bounded decorative light DOM. Alert preserves its authored
message and action nodes. Input, file upload, and progress keep native controls inside so forms, validation,
autofill, and accessibility remain browser-owned.

### Behavioral elements

Tabs, tooltip, popup, listbox, and dialog controllers enhance authored light DOM. They do not accept render
callbacks or arbitrary data structures that would require a rendering engine.

### Fully managed elements

Select, dropdown, autocomplete, table, and toast region own bounded dynamic DOM. Options, rows, and toast
items use small keyed updates with documented limits.

## Registration

Component modules export explicit `defineAlt*` functions. Importing a module never registers an element and
never reads `window`, `document`, `HTMLElement`, or `customElements`. Registration is idempotent and happens
only when the application calls a define function in a browser.

## Forms

Internal native inputs are preferred over `ElementInternals`. A custom select uses a hidden native select as
its form carrier. `ElementInternals` is reserved for controls that cannot accurately submit through a native
carrier.

## Server markup

Server output remains useful before upgrade. Native recipes render directly. Input can reuse matching
`data-alt-owned` parts. Fully managed elements preserve declarative configuration, but exclusively own their
documented internal descendants. Hydration never runs a virtual DOM or general reconciliation algorithm.

Table keeps keyed row and cell elements, but does not reconcile arbitrary nested trees. Its intended range
is ordinary admin tables up to a few hundred rendered rows. Virtualization, editable grids and deeply
stateful cell trees stay in application code or a specialized grid.
