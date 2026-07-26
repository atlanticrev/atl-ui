# Поддерживаемый публичный API

Документ описывает публичную поверхность релиза `0.5.0`. Источники истины:
`package.json#exports`, `src/index.ts`, component barrels и три CSS entry points. Внутренние файлы вне export
map не считаются публичным API.

## Каталог: 34 поддерживаемые позиции

### Managed и behavioral компоненты

| Каталог | Custom element | Точечный импорт |
|---|---|---|
| Alert | `<alt-alert>` | `@atlanticrev/atl-ui-vanilla/alert` |
| Autocomplete | `<alt-autocomplete>` | `@atlanticrev/atl-ui-vanilla/autocomplete` |
| Avatar | `<alt-avatar>` | `@atlanticrev/atl-ui-vanilla/avatar` |
| Calendar | `<alt-calendar>` | `@atlanticrev/atl-ui-vanilla/calendar` |
| Collapse | `<alt-collapse>` | `@atlanticrev/atl-ui-vanilla/collapse` |
| Date Picker | `<alt-date-picker>`, `<alt-date-range-picker>` | `@atlanticrev/atl-ui-vanilla/date-picker` |
| Dialog | `<alt-dialog>` | `@atlanticrev/atl-ui-vanilla/dialog` |
| Drawer и Sheet | `<alt-drawer>` | `@atlanticrev/atl-ui-vanilla/drawer` |
| Dropdown | `<alt-dropdown>` | `@atlanticrev/atl-ui-vanilla/dropdown` |
| File upload | `<alt-file-upload>` | `@atlanticrev/atl-ui-vanilla/file-upload` |
| Input | `<alt-input>` | `@atlanticrev/atl-ui-vanilla/input` |
| Menu | `<alt-menu>` | `@atlanticrev/atl-ui-vanilla/menu` |
| Pagination | `<alt-pagination>` | `@atlanticrev/atl-ui-vanilla/pagination` |
| Popup | `<alt-popup>` | `@atlanticrev/atl-ui-vanilla/popup` |
| Progress | `<alt-progress>` | `@atlanticrev/atl-ui-vanilla/progress` |
| Search | `<alt-search>` | `@atlanticrev/atl-ui-vanilla/search` |
| Select | `<alt-select>`, `<alt-option>` | `@atlanticrev/atl-ui-vanilla/select` |
| Table | `<alt-table>` | `@atlanticrev/atl-ui-vanilla/table` |
| Tabs | `<alt-tabs>` | `@atlanticrev/atl-ui-vanilla/tabs` |
| Textarea | `<alt-textarea>` | `@atlanticrev/atl-ui-vanilla/textarea` |
| Toast | `<alt-toast-region>` | `@atlanticrev/atl-ui-vanilla/toast` |
| Tooltip | `<alt-tooltip>` | `@atlanticrev/atl-ui-vanilla/tooltip` |

Каждый точечный entry point экспортирует `defineAlt*`, factory класса, типы properties/events и связанные
чистые helpers, если они относятся к контракту компонента. Импорт не регистрирует custom element
автоматически. `defineAlt*` идемпотентен и безопасен вне browser environment.

### Native CSS recipes

| Каталог | Публичный markup/selector |
|---|---|
| Button | `.alt-button` |
| Card | `.alt-card` |
| Divider | `.alt-divider` |
| Breadcrumbs | `.alt-breadcrumbs` |
| Checkbox | `.alt-checkbox` и `.alt-checkbox__control` |
| Radio | `.alt-radio` и `.alt-radio__control` |
| Switcher | `.alt-switcher` и `.alt-switcher__control` |
| Chip | `.alt-chip` |
| Skeleton | `.alt-skeleton` и `.alt-skeleton-wrapper` |
| Spinner | `.alt-spinner` |
| Stepper | `.alt-stepper` |
| Sidebar | `.alt-sidebar` |

Recipes не имеют отдельных JavaScript entry points: это намеренно native markup, подключаемый через CSS.
Интерактивные authored части используют native elements и документированные `data-*`/ARIA contracts.

## Package entry points

| Импорт | Назначение |
|---|---|
| `@atlanticrev/atl-ui-vanilla` | Все публичные JS symbols без auto-registration |
| `@atlanticrev/atl-ui-vanilla/define-all` | Явная регистрация полного набора элементов |
| `@atlanticrev/atl-ui-vanilla/core` | Base element, converters, events, batching и registration helpers |
| `@atlanticrev/atl-ui-vanilla/controllers` | Dismiss, focus, form carrier, open state, position, observers, selection и typeahead |
| `@atlanticrev/atl-ui-vanilla/icons` | Tree-shakeable SVG factories, markup helpers и icon types |
| `@atlanticrev/atl-ui-vanilla/core.css` | Default light/dark `--alt-*` tokens |
| `@atlanticrev/atl-ui-vanilla/theme.css` | Base styles и component recipes без default tokens |
| `@atlanticrev/atl-ui-vanilla/default.css` | `core.css` и `theme.css` одним импортом |

`define-all` регистрирует все 24 custom elements. `alt-option` регистрируется как зависимость Select и
Dropdown и поэтому не имеет отдельного ключа в результате `defineAllAltElements()`.

## Публичная инфраструктура

- Core: attribute converters, base element factory, microtask batching, typed custom events, pre-upgrade
  property handling и `registerElement`.
- Controllers: dismiss, focus, form carrier, open state, anchored position, position observer, selection и
  typeahead.
- Icons: `createAltIcon`, `setAltIcon`, `syncAltIconContent`, `altIconMarkup`, `AltIconName` и
  `AltIconOptions`.
- Icon names: `arrow-left`, `arrow-right`, `chart`, `check`, `chevron-down`, `chevron-left`,
  `chevron-right`, `close`, `error`, `eye`, `grid`, `home`, `info`, `minus`, `more-horizontal`, `plus`,
  `search`, `star`, `upload`, `warning`.

## Гарантии и границы

- Ноль runtime dependencies.
- Light DOM; Shadow DOM и Virtual DOM отсутствуют.
- Individual imports не регистрируют элементы и не тянут `define-all`.
- Public imports и вызовы регистрации SSR-safe.
- Form controls сохраняют submit, reset, validation и FormData contracts.
- CSS selectors, `--alt-*` tokens, attributes и `alt-*` events считаются consumer-facing API, если они
  описаны в package docs.
- ReactNode, arbitrary render callbacks, virtualization, routing и application state не входят в vanilla
  API.

Release gate `npm run verify:vanilla:consumer` подтверждает установку tarball в чистый проект, все точечные
imports из export map, SSR safety, отсутствие runtime dependencies и tree-shaking boundary.
