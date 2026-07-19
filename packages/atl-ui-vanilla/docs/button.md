# Button

`alt-button` — CSS recipe для нативных `<button>` и `<a>`. JavaScript, Custom Element и регистрация не
нужны.

## Варианты, размеры и tones

```html
<button class="alt-button" data-variant="filled" type="button">Publish</button>
<button class="alt-button" data-variant="tonal" data-tone="success" type="button">Approve</button>
<button class="alt-button" data-variant="outlined" data-tone="danger" type="button">Remove</button>
```

Варианты: `filled`, `tonal`, `outlined`, `text`, `elevated` и совместимый `danger`. Для нового кода лучше
использовать `data-variant="filled" data-tone="danger"`. Tones: `accent` по умолчанию, `danger` и `success`.
Размеры: `24`, `32`, `40` по умолчанию и `48`.

Размеры `24` и `32` предназначены для плотных desktop-интерфейсов. Для touch-интерфейсов используйте
`40` или `48`, чтобы сохранить удобную область нажатия.

## Иконки

```html
<button class="alt-button" data-variant="filled" type="button">
  <span class="alt-button__icon alt-button__icon--start" aria-hidden="true">+</span>
  <span class="alt-button__content">Add channel</span>
</button>

<button aria-label="Add channel" class="alt-button" data-icon-only type="button">
  <span class="alt-button__icon" aria-hidden="true">+</span>
</button>
```

Иконки автоматически масштабируются вместе с кнопкой. Icon-only кнопке всегда требуется доступное имя
через `aria-label` или `aria-labelledby`.

## Loading

```html
<button
  aria-busy="true"
  class="alt-button"
  data-loading
  data-loading-position="center"
  data-variant="filled"
  disabled
  id="publish-button"
  type="button"
>
  <span aria-labelledby="publish-button" class="alt-button__loading-indicator" role="progressbar"></span>
  <span class="alt-button__content">Publish</span>
</button>
```

Позиции индикатора: `start`, `center` по умолчанию и `end`. На время операции обязательны:

- `data-loading` для визуального состояния;
- `aria-busy="true"` для assistive technologies;
- нативный `disabled` для полной блокировки pointer, keyboard и form activation;
- уникальный `id` кнопки и соответствующий `aria-labelledby` на `progressbar`.

При центральном loading контент получает `opacity: 0`, а не `visibility: hidden`, поэтому имя кнопки
остаётся в accessibility tree. После завершения операции удалите `data-loading`, `aria-busy` и `disabled`.

## Width и elevation

```html
<button class="alt-button" data-full-width data-variant="filled" type="button">Continue</button>
<button class="alt-button" data-elevation="none" data-variant="filled" type="button">Save</button>
```

## Button group

```html
<div aria-label="Editor mode" class="alt-button-group" role="group">
  <button class="alt-button" data-variant="outlined" type="button">Write</button>
  <button class="alt-button" data-variant="outlined" type="button">Preview</button>
</div>
```

Группа поддерживает `data-orientation="vertical"` и `data-full-width`. `role="group"` и доступное имя нужны,
когда связь кнопок неочевидна из контекста. Каждая отключённая кнопка получает собственный `disabled`.

## Ссылки

```html
<a class="alt-button" data-variant="text" href="/settings">Settings</a>
<a aria-disabled="true" class="alt-button" data-variant="text">Settings unavailable</a>
```

Ссылка остаётся `<a>`, а действие — `<button>`. Для отключённой ссылки удаляйте `href`;
`aria-disabled="true"` не отменяет переход и keyboard activation.

## Theme overrides

Состояния можно переопределить через `--alt-button-bg`, `--alt-button-bg-hover`, `--alt-button-bg-active`,
аналогичные `border`, `color`, `shadow` и `disabled-*` переменные. Overrides помещаются после library CSS
или в `@layer alt.overrides`.
