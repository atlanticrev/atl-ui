# Select и Autocomplete

Оба компонента используют light DOM, общий отменяемый open-state и настоящий `<select>` для участия
в обычной форме. Shadow DOM, React и runtime renderer не используются.

## Composition

- `[data-alt-select-trigger]` заменяет стандартный trigger Select.
- `[data-alt-select-value]`, `[data-alt-select-label]` и `[data-alt-select-indicator]` — необязательные
  обновляемые части авторского trigger.
- Содержимое `<alt-option>` не клонируется: сохраняются узлы, обработчики и локальное состояние.
- `[data-alt-autocomplete-input]` принимает обычный `<input>` или `<alt-input>`.
- `[data-alt-autocomplete-trigger]` и `[data-alt-autocomplete-clear]` заменяют стандартные actions.

## Пользовательские иконки

Стандартный trigger Select принимает любой SVG/Node через `leadingIcon` и `indicatorIcon`. Опции имеют
`option.icon` и `option.checkIcon`, а авторский trigger может содержать любое число собственных SVG:

```ts
const select = document.querySelector('alt-select');
select.indicatorIcon = myChevronSvg;
select.leadingIcon = myChannelSvg;
select.options = [
  { checkIcon: selectedSvg, icon: youtubeSvg, label: 'YouTube', value: 'youtube' },
  { icon: tiktokSvg, label: 'TikTok', value: 'tiktok' },
];
```

`Autocomplete` имеет `indicatorIcon`, `clearIcon` и `noResultsIcon`, а также позволяет целиком заменить
кнопки открытия и очистки через light DOM. `undefined` восстанавливает встроенную иконку, `null` скрывает
её. Переданные в одну позицию Node не клонируются.

## State и события

`open`, `value`, `values`, `options` и `inputValue` доступны как properties. Select дополнительно имеет
`show()`, `close()`, `toggle()`, `select()` и `clear()`. Autocomplete имеет `clear()`.

Перед переходом отправляется отменяемый `alt-before-open-change`. После успешного перехода отправляется
`alt-open-change` с `{ open, reason, sourceEvent }`. Причины различают trigger, input, focus, Escape,
outside click, selection и programmatic update.

`alt-change` сообщает `value`, `values`, option и причину `select`, `remove`, `clear` или `create`.
Autocomplete отдельно отправляет `alt-input`, поэтому query не смешивается с выбранным value.

## Поведение

- Повторный click по trigger всегда закрывает popup.
- Single Select и Autocomplete закрываются после выбора; multiple остаётся открытым.
- `close-on-select="false"`, `open-on-focus="false"`, `clear-on-blur="false"` и
  `clear-on-escape="false"` переопределяют defaults.
- Autocomplete поддерживает async `options`, custom `filter`, `loading`, `free-solo` и `multiple`.
- Arrow keys, Home, End, Page Up/Down, Enter, Escape и Tab следуют combobox/listbox keyboard pattern.
- IME composition не подтверждает значение преждевременно.
- Focused и open trigger сохраняет accent border при pointer hover.

Disabled option пропускается клавиатурой. `disabled` блокирует открытие, а `readonly` сохраняет focus,
но блокирует изменение значения. Native carrier обеспечивает FormData, required validation и reset.
