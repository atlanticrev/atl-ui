# Calendar and date pickers

Календарный стек использует date-only значения `YYYY-MM-DD`. Они сравниваются без локального времени и не
преобразуются через timezone. Все три элемента регистрируются явно:

```ts
import { defineAltCalendar } from '@atlanticrev/atl-ui-vanilla/calendar';
import {
  defineAltDatePicker,
  defineAltDateRangePicker,
} from '@atlanticrev/atl-ui-vanilla/date-picker';

defineAltCalendar();
defineAltDatePicker();
defineAltDateRangePicker();
```

`date-picker` не регистрирует вложенный `alt-calendar` автоматически. При выборочных imports приложение должно
вызвать обе функции; `defineAllAltElements()` делает это за приложение.

## Calendar

```html
<alt-calendar
  selection-mode="range"
  commit-mode="explicit"
  start="2026-07-01"
  end="2026-07-22"
  min="2024-01-01"
  max="2026-12-31"
  locale="en-GB"
  first-day="1"
></alt-calendar>
```

- `selection-mode`: `single` (default) или `range`.
- `view`: `days` (default), `months` или `years`.
- `commit-mode="explicit"` показывает Apply; иначе завершённый выбор сразу отправляет `alt-change`.
- `disabledDate(value)` принимает date-only value и возвращает `boolean`.
- `presets` принимает `{ label, start, end? }[]`.
- `alt-input` сообщает preview, `alt-change` — committed state. Detail содержит `value`, `range`, `mode` и
  `complete`.

Day grid поддерживает стрелки, Home/End и PageUp/PageDown. Month/year selectors и ограничения `min`/`max`
доступны с клавиатуры как native buttons.

## DatePicker and DateRangePicker

```html
<form>
  <alt-date-picker name="publishDate" required></alt-date-picker>
  <alt-date-range-picker name="from" name-end="to"></alt-date-range-picker>
</form>
```

Пикеры участвуют в `FormData` и native reset через скрытые native select carriers. Range picker использует
explicit Apply по умолчанию; single picker закрывается после выбора дня. `initial-view="years"` предназначен,
например, для даты рождения. Общие атрибуты: `value`, `start`, `end`, `min`, `max`, `locale`, `first-day`,
`disabled`, `required`, `placeholder` и `open`.

События `alt-input` и `alt-change` содержат `{ value, range }`. `Escape`, клик снаружи и успешный commit
закрывают popup; фокус возвращается на trigger.

Открытая панель рендерится через browser top layer и поэтому не обрезается `overflow`, `contain` или
stacking context родительских контейнеров. В браузерах без Popover API панель временно переносится в
`document.body` и возвращается в picker при закрытии или disconnect.
