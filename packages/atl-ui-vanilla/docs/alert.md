# Alert

`<alt-alert>` показывает inline-feedback без прерывания работы пользователя. API повторяет основные
возможности MUI Alert, но использует light DOM, browser events и обычные `Node` вместо React props.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAltAlert } from '@atlanticrev/atl-ui-vanilla/alert';

defineAltAlert();
```

```html
<alt-alert dismissible severity="warning" variant="outlined">
  <strong class="alt-alert__title">Schedule conflict</strong>
  This post overlaps another publication.
</alt-alert>
```

## API

- `severity`: `success` по умолчанию, `info`, `warning` или `error`; задаёт смысл и default icon;
- `color`: независимо переопределяет цвет, не меняя смысл иконки;
- `variant`: `standard` по умолчанию, `outlined` или `filled`;
- `dismissible`: показывает стандартную кнопку закрытия, если custom action отсутствует;
- `close-label`: локализует accessible name кнопки, по умолчанию `Close alert`;
- `role`: по умолчанию `alert`; для менее срочных сообщений явно используйте `role="status"`.

Свойства `icon`, `closeIcon` и `action` принимают обычный `Node`. Для `icon` и `closeIcon` значение
`undefined` включает встроенную SVG-иконку, `null` скрывает её, а `Node` заменяет без клонирования.
`iconMapping` задаёт отдельные замены по severity.

Declarative custom parts остаются в light DOM:

```html
<alt-alert severity="success">
  <svg aria-hidden="true" data-alt-alert-icon><!-- ... --></svg>
  Settings saved.
  <button class="alt-button alt-alert__action-button" data-alt-alert-action data-size="32"
    data-variant="text" type="button">Undo</button>
</alt-alert>
```

Custom action, как и в MUI, заменяет стандартную close-кнопку. Доступны readonly-ссылки
`messageElement` и `actionElement` для точечных динамических обновлений.

## Закрытие

Close-кнопка и метод `close()` отправляют bubbling/composed/cancelable событие `alt-close`:

```ts
alert.addEventListener('alt-close', (event) => {
  console.log(event.detail.reason); // close-button | programmatic
});
```

Если событие отменено через `preventDefault()`, alert остаётся открытым. Иначе ставится нативный `hidden`.
Метод `show()` снова показывает тот же DOM без пересоздания содержимого.

Alert не закрывается по таймеру и не перемещает keyboard focus. Интерактивный authored action должен быть
настоящей кнопкой или ссылкой. Цвет всегда дублируется SVG-иконкой и текстом сообщения.

## CSS overrides

По умолчанию Alert использует `width: fit-content` и занимает ширину содержимого, но ограничен
`max-width: 100%`. Для полноширинного сообщения приложение может явно задать `width: 100%`.

Все части namespaced: `.alt-alert__icon`, `.alt-alert__message`, `.alt-alert__title`,
`.alt-alert__action`, `.alt-alert__close`. Для тонкой настройки доступны `--alt-alert-radius`,
`--alt-alert-shadow` и tone variables `--alt-alert-*-main|muted|border|ink|filled-ink`.
