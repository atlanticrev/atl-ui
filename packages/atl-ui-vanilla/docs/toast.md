# Toast

`<alt-toast-region>` — независимый от фреймворка менеджер уведомлений. Разметка остаётся в light DOM,
runtime-зависимостей и portal нет.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAltToastRegion } from '@atlanticrev/atl-ui-vanilla/toast';

defineAltToastRegion();
```

```html
<alt-toast-region default-duration="5000" max="3" prevent-duplicate></alt-toast-region>
```

## API

```ts
const region = document.querySelector('alt-toast-region');
const id = region.push({
  message: 'Post published',
  status: 'success',
});

region.dismiss(id);
region.clear();
```

`push()` принимает строку либо объект:

- `message` — безопасный текст сообщения;
- `status` — `info`, `success`, `warning` или `error`;
- `duration` — время показа в миллисекундах, `0` означает без автозакрытия;
- `dismissible` — показать или скрыть кнопку закрытия;
- `persist` — игнорировать таймер независимо от `duration`;
- `preventDuplicate` — переопределить политику дубликатов для одного сообщения;
- `id` — стабильный ключ; повторный `push()` с тем же `id` обновляет существующий toast.

Свойства региона: `defaultDuration`, `max`, `preventDuplicate`. После завершения exit и collapse
регион отправляет bubbling/composed событие `alt-dismiss` с `{ id, status, reason }`. Возможные причины:
`timeout`, `close`, `programmatic`, `clear`, `overflow`.

## Поведение

Жизненный цикл разделён на `queued → entering → open → closing → collapsing`. Элемент удаляется только
после завершения обеих выходных фаз. Если `animationend` недоступен, встроенный timeout завершит переход.
Очередь соблюдает `max`, не перестраивая уже существующие DOM-узлы.

Таймер приостанавливается независимо по каждой причине: pointer hover, focus внутри toast, скрытая вкладка,
blur окна и disconnect custom element. Поэтому снятие одной паузы не отменяет остальные.

Обычные статусы объявляются через `role="status"`, ошибки — через `role="alert"`; сообщение атомарно,
кнопка закрытия — настоящий `<button>`. При `prefers-reduced-motion` переходы завершаются практически
мгновенно, но проходят тот же lifecycle.

## Настройка

```css
@layer alt.overrides {
  alt-toast-region {
    --alt-toast-enter-duration: 180ms;
    --alt-toast-exit-duration: 140ms;
    --alt-toast-collapse-duration: 160ms;
    --alt-toast-z-index: 100;
  }
}
```
