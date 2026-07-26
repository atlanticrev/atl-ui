# Content overflow contract

Every text-bearing component part owns one explicit overflow policy. Important content must never be
silently clipped, and a component must not widen the page at the supported 320 px viewport.

## Policies

- `wrap`: helper text, errors, descriptions, toast messages and dialog content use
  `overflow-wrap: anywhere`.
- `ellipsis`: compact values such as selected options, file names, identifiers and chip labels use one
line with an ellipsis. The complete value must remain available in context or through an accessible
tooltip.
- `clamp`: optional card previews may use a documented line count. Errors and form guidance never clamp.
- `scroll`: tables, horizontal tabs and segmented controls keep their semantics and scroll internally.
- `reflow`: important actions remain readable. Buttons and action groups wrap or rearrange instead of
  hiding their label.

Flex and grid text owners must use `min-width: 0`. Long metadata must also handle unbroken URLs, IDs,
Cyrillic, CJK, emoji and RTL content.

`alt-tooltip[show-on-overflow]` checks the trigger or its `[data-alt-overflow-target]` descendant at the
moment of hover, focus or click. It stays closed when the complete text is already visible.

## Table columns

`AltTableColumn` accepts `width`, `minWidth`, `overflow` and `fixed`. Use `nowrap` for numeric, status and
action columns, `ellipsis` for compact identifiers, and `wrap` for prose. Set `fixed: 'left'` or
`fixed: 'right'` to keep one or more columns visible inside the horizontal scroll region. The component
calculates cumulative offsets from rendered column widths and recalculates them when the table resizes.
Keep the total width of fixed columns smaller than the available scroll viewport.

The table has a configurable `--alt-table-min-width`; below it, `.alt-simple-table__scroll` becomes the
horizontal scroll owner.

## Story and test matrix

Every component story includes a long-content or narrow-container example. Browser tests cover 320 and
390 px viewports, unexpected page overflow, table cell overlap, real ellipsis and visual snapshots.

Additional manual checks should include 200% text zoom, keyboard focus, touch access to complete values,
and translations expanded by 30–50%. Vitest covers public APIs and CSS contracts; Playwright covers real
layout because DOM emulators do not calculate reliable element geometry.
