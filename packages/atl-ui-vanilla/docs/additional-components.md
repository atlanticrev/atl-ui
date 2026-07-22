# Additional components

## Behavioral elements

- `alt-collapse` расширяет authored `<details>`; атрибут `single` включает accordion mode, `openKeys`
  управляет открытыми секциями, `alt-change` возвращает актуальные keys.
- `alt-menu` расширяет authored trigger `[data-alt-menu-trigger]` и соседний `[role="menu"]`. Поддерживаются
  ArrowUp/ArrowDown, Home/End, Escape, outside dismiss и `alt-select` с `{ item, value }`.
- `alt-pagination` принимает `page`, `page-size`, `total` и property `pageSizeOptions`. `alt-change` возвращает
  `{ page, pageSize }`; компонент можно связать с существующими Table и Select без их взаимной регистрации.
- `alt-search` держит настоящий `<input type="search">`, поэтому поддерживает FormData/reset. События
  `alt-input`/`alt-change` возвращают `{ value }`; clear action имеет собственное accessible name.

## Existing components: new variants

- `alt-progress shape="circular"` использует тот же native `<progress>`, statuses и indeterminate contract.
- `alt-tabs data-variant="underline"` использует существующую keyboard model. Счётчик оформляется классом
  `.alt-tabs__counter`.

## Native CSS recipes

```html
<hr class="alt-divider" />
<span class="alt-spinner" role="status" aria-label="Loading"></span>
<ol class="alt-stepper" aria-label="Setup progress">
  <li class="alt-stepper__step" data-status="complete">Details</li>
  <li class="alt-stepper__step" aria-current="step">Audience</li>
</ol>
```

Divider сохраняет native separator semantics. Spinner требует доступное имя. Stepper остаётся ordered list и
адаптируется в вертикальную раскладку на узком экране.
