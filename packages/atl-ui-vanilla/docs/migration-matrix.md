# Матрица React → Vanilla

Массовый перенос завершён. `Готово` означает, что компонент или recipe есть в публичном CSS/JS контракте,
представлен в каталоге и входит в package validation. Это не означает буквальное совпадение React props:
vanilla использует native markup, properties, attributes и `alt-*` events.

| React или UI-концепция | Vanilla-контракт | Тип | Статус |
|---|---|---|---|
| `AtlAlert` | `<alt-alert>` | managed element | Готово |
| `AtlButton` | `<button class="alt-button">` | CSS/native recipe | Готово |
| `AtlCard` | `<article|section class="alt-card">` | CSS/native recipe | Готово |
| Divider | `.alt-divider` | CSS/native recipe | Готово |
| `AtlBreadcrumbs` | `<nav class="alt-breadcrumbs">` с authored links/buttons | CSS/native recipe | Готово |
| `AtlCheckbox` | `.alt-checkbox` с native checkbox | CSS/native recipe | Готово |
| `AtlRadioButton` | `.alt-radio` с native radio | CSS/native recipe | Готово |
| `AtlSwitcher` | `.alt-switcher` с native checkbox и `role="switch"` | CSS/native recipe | Готово |
| `AtlChip` | `.alt-chip`; actionable chip остаётся native button | CSS/native recipe | Готово |
| `AtlSkeleton` | atomic `.alt-skeleton` и content-backed `.alt-skeleton-host` | CSS/native recipe + helper | Готово |
| Spinner | `.alt-spinner` | CSS/native recipe | Готово |
| Stepper | `.alt-stepper` | CSS/native recipe | Готово |
| `AtlSidebar` | `<nav class="alt-sidebar">` с authored navigation | CSS/native recipe | Готово |
| `AtlTabs` | `<alt-tabs>` над authored tabs и panels | behavioral element | Готово |
| Collapse/Accordion | `<alt-collapse>` над authored `<details>` | behavioral element | Готово |
| Menu | `<alt-menu>` над trigger и `[role="menu"]` | behavioral element | Готово |
| `AtlTooltip` | `<alt-tooltip>` над authored trigger/content | overlay element | Готово |
| `AtlPopup` | `<alt-popup>` | overlay element | Готово |
| `AtlModal` | `<alt-dialog>` с native `<dialog>` | overlay element | Готово |
| Calendar | `<alt-calendar>` с single/range selection и day/month/year views | managed element | Готово |
| Date Picker / Date Range Picker | `<alt-date-picker>`, `<alt-date-range-picker>` | form-associated elements | Готово |
| `AtlInput` | `<alt-input>` с native input | form-associated element | Готово |
| Multiline text | `<alt-textarea>` с native textarea и статичным notched label | form-associated element | Готово |
| Search | `<alt-search>` с native `input[type="search"]` | form-associated element | Готово |
| `AtlSelect` | `<alt-select>` и `<alt-option>` со скрытым native select carrier | form-associated element | Готово |
| `AtlAutocomplete` | `<alt-autocomplete>` с combobox/listbox contract | form-associated element | Готово |
| `AtlDropdown` | `<alt-dropdown>` и authored/typed options | managed listbox | Готово |
| `AtlAvatar` | `<alt-avatar>` с image/initials fallback | managed element | Готово |
| `AtlFileUpload` | `<alt-file-upload>` с native file input | form-associated element | Готово |
| `AtlProgress` | `<alt-progress>` с determinate/indeterminate state | managed element | Готово |
| Pagination | `<alt-pagination>` | managed element | Готово |
| `AtlSimpleTable` | `<alt-table>` с bounded keyed row updates | managed element | Готово |
| `ToastProvider` | `<alt-toast-region>` | managed live region | Готово |

## Намеренные различия

- Sidebar не владеет routing и collapse state приложения.
- Table не принимает React render callbacks; приложение готовит serializable cells или authored content.
- Select, Autocomplete и Toast используют bounded keyed updates, но пакет не предоставляет общий renderer.
- Popover API, CSS Anchor Positioning и `<dialog>` используются с проверенными fallback-механизмами.
- Native Checkbox, Radio и Switcher сохраняют browser form semantics вместо React state wrappers.
- Calendar и Date Picker делят date utilities и rendering contract, но остаются самостоятельными публичными
  элементами.

Подробный список custom elements, импортов, CSS entry points, controllers и icons находится в
[`public-api.md`](public-api.md).
