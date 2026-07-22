# Drawer и мобильные Sheet

`<alt-drawer>` — один modal-компонент для четырёх направлений. Атрибут `placement` определяет продуктовый
вариант:

- `left` и `right` — боковой Drawer;
- `bottom` и `top` — мобильная шторка (Sheet).

Оба варианта используют один lifecycle, native `<dialog>`, backdrop, восстановление фокуса, Escape и
touch-dismiss. В demo они намеренно показаны отдельными секциями, потому что решают разные задачи интерфейса.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAltDrawer } from '@atlanticrev/atl-ui-vanilla/drawer';

defineAltDrawer();
```

```html
<button id="open-menu" type="button">Open menu</button>

<alt-drawer id="menu" labelled-by="menu-title" placement="left">
  <header class="alt-drawer__header">
    <h2 class="alt-drawer__title" id="menu-title">Menu</h2>
    <button data-alt-drawer-close type="button">Close</button>
  </header>
  <div class="alt-drawer__body">...</div>
</alt-drawer>
```

```ts
const drawer = document.querySelector('#menu');

document.querySelector('#open-menu').addEventListener('click', () => drawer.showModal());
```

Authored nodes сохраняются и один раз помещаются внутрь принадлежащего компоненту `<dialog>`. Можно также
передать готовый дочерний `<dialog>`: компонент добавит ему класс `.alt-drawer` и не пересоздаст содержимое.

## Публичный контракт

Доступное имя внутреннего `<dialog>` задают атрибуты `label`, `labelled-by` и `described-by`. Для первых
двух также доступны properties `label` и `labelledBy`.

Остальные атрибуты и одноимённые properties:

- `open: boolean` — видимое modal-состояние;
- `placement: 'left' | 'right' | 'top' | 'bottom'`, по умолчанию `left`;
- `close-on-backdrop: boolean`, по умолчанию `true`;
- `close-on-escape: boolean`, по умолчанию `true`;
- `swipe-to-close: boolean`, по умолчанию `true`.

Методы и read-only properties:

- `showModal()` открывает Drawer или Sheet;
- `close(returnValue?)` закрывает его программно;
- `returnValue` возвращает значение последнего закрытия;
- `dialogElement` даёт доступ к owned native `<dialog>`.

Кнопка с `data-alt-drawer-close` закрывает компонент. Значение атрибута становится `returnValue`:

```html
<button data-alt-drawer-close="saved" type="button">Save</button>
```

События:

- `alt-open-change`: `{ open, reason }`;
- `alt-close`: `{ reason, returnValue }`.

Причина закрытия: `action`, `backdrop`, `escape`, `gesture` или `programmatic`.

## Touch-жесты

Панель следует за пальцем только в сторону закрытия. Жест активируется после 12 px и закрывает панель после
прохождения половины размера либо при быстром движении от 700 px/s. Обычный snap длится 250 ms, быстрый —
от 50 до 200 ms. После свайпа блокируется совместимый browser click, чтобы пользователь случайно не нажал
на элемент под панелью.

Для вертикальной шторки используйте `data-alt-drawer-handle` на ручке и `data-alt-drawer-scroll` на
скроллируемой области. Жест из контента начинается только на соответствующей границе scroll: сверху у
bottom Sheet и снизу у top Sheet. Поэтому прокрутка содержимого не конфликтует с закрытием.

## Стили и authored composition

Доступные классы частей: `.alt-drawer__header`, `.alt-drawer__title`, `.alt-drawer__body`,
`.alt-drawer__footer`, `.alt-drawer__handle`. Внутри можно использовать остальные компоненты библиотеки:
например Sidebar в боковой панели и Input/Select в нижней шторке.

Основные CSS properties для локальной настройки:

- `--alt-drawer-size`;
- `--alt-drawer-sheet-max-size` и `--alt-drawer-sheet-radius`;
- `--alt-drawer-padding`, `--alt-drawer-gap`, `--alt-drawer-background`;
- `--alt-drawer-border-color`, `--alt-drawer-shadow`;
- `--alt-drawer-scrim-color`, `--alt-drawer-scrim-opacity`;
- `--alt-drawer-snap-duration`, `--alt-drawer-easing`, `--alt-drawer-handle-color`.

Компонент учитывает `prefers-reduced-motion` и убирает длительность snap-анимации.

## Modal и accessibility

Native `<dialog>.showModal()` помещает панель и backdrop в top layer: её не обрезают `overflow`, `contain`,
transform и stacking context родителей. Браузер делает остальную страницу inert, удерживает клавиатурный
фокус внутри modal и возвращает его на ранее сфокусированный элемент после закрытия.

Передавайте доступное имя через `labelled-by` или `label`. Компонент устанавливает соответствующие
`aria-labelledby` или `aria-label` на внутренний semantic `<dialog>`; ARIA не остаётся на несемантическом
custom-element host. Заголовок должен быть authored HTML, а icon-only кнопка закрытия — иметь `aria-label`.
Popup, Select и Autocomplete внутри Drawer продолжают использовать общий anchored-overlay и рисуются поверх
modal.
