# Матрица миграции компонентов

Сложность: `L` — CSS/native markup, `M` — контролируемое поведение, `H` — сложный state/DOM.

- `AtlButton` → native `<button class="alt-button">` с `data-variant` и `data-size`.
  Native click, disabled и focus. Приоритет P0, сложность L.
- `AtlCard` → `<article|section class="alt-card">` с authored content.
  Приоритет P0, сложность L.
- `AtlInput` → `<alt-input>` с value/icons properties и `alt-input`/`alt-change`.
  Owned light DOM с native input, label, form validation и focus/select. P0/M.
- `AtlSelect` → `<alt-select>` плюс `<alt-option>` или typed `options`.
  Custom trigger/listbox и hidden select. Arrow/Home/End/Enter/Space/Escape. P0/H.
- `AtlTabs` → behavioral `<alt-tabs active-key>` над authored tabs и panels.
  Roving tabindex, ARIA linking, arrows/Home/End и `alt-change`. P0/M.
- `ToastProvider` → `<alt-toast-region>` с push/dismiss/clear и `alt-dismiss`.
  Owned keyed list, live region и pausable timers. P0/M.
- `AtlCheckbox` → native checkbox внутри `.alt-checkbox`.
  `indeterminate` остаётся input property; native change и Space. P0/L.
- `AtlRadioButton` → native radio внутри `.alt-radio`.
  Native name grouping, change и keyboard. P1/L.
- `AtlSwitcher` → native checkbox с `.alt-switcher` и `role="switch"`.
  Native forms и Space. P1/L.
- `AtlBreadcrumbs` → `<nav class="alt-breadcrumbs"><ol>...`.
  Настоящие links/buttons и `aria-current="page"`. P1/L.
- `AtlChip` → `.alt-chip` с optional native remove button.
  Remove callback становится click или `alt-remove`. P1/L.
- `AtlSkeleton` → `.alt-skeleton` recipes.
  `aria-busy` остаётся на реальном region; decoration скрывается от AT. P1/L.
- `AtlProgress` → `<alt-progress>` вокруг native `<progress>`.
  value/max/status attributes; отсутствие value означает indeterminate. P1/L.
- `AtlAvatar` → `<alt-avatar>` с owned `<img>` и initials fallback.
  Meaningful image требует alt; ошибка становится `alt-error`. P1/M.
- `AtlFileUpload` → `<alt-file-upload>` с `<input type="file">`.
  accept/multiple/name attributes, files property и `alt-change`. P1/M.
- `AtlPopup` → behavioral `<alt-popup>` или positioning controller.
  Popover enhancement, dismiss, position и focus restore. P2/M.
- `AtlTooltip` → behavioral `<alt-tooltip>` над trigger/content.
  Hover и focus, Escape, `role="tooltip"`, без focus trap. P2/M.
- `AtlModal` → native `<dialog class="alt-dialog">` и controller.
  showModal/close, cancel, focus trap/restore, authored header/footer. P2/M.
- `AtlDropdown` → behavioral `alt-listbox` над authored options.
  Value properties/events и listbox keyboard/selection. P2/H.
- `AtlAutocomplete` → managed `<alt-autocomplete>` с native text input.
  Combobox ARIA, filtering, async-safe options и form carrier. P3/H.
- `AtlSidebar` → `<nav class="alt-sidebar">` с authored links/buttons.
  `selectedKey` становится `aria-current`; app владеет routing/collapse state. P3/M.
- `AtlSimpleTable` → native `<table class="alt-table">`.
  App рендерит cells/rows и keyed data; headers и sort buttons semantic. P3/H.

`render`, `filterFn` и ReactNode callbacks не становятся строковыми attributes. Select и Toast используют
только локальный keyed update для ограниченных списков. Editable или virtualized tables остаются задачей
приложения: общий renderer и reconciliation в библиотеку не добавляются.
