# Overlays

Все привязанные к trigger всплывающие элементы используют один внутренний anchored-overlay lifecycle:

- `alt-popup` показывает произвольное authored content;
- Select и Autocomplete показывают listbox/dropdown;
- Date Picker и Date Range Picker показывают Calendar;
- Menu сохраняет menu keyboard pattern;
- Tooltip сохраняет `role="tooltip"`, hover/focus behavior и стрелку для фактического placement.

При открытии панель попадает в browser top layer через `popover="manual"`. Поэтому `overflow`, `contain`,
transform и локальные stacking contexts родителей её не обрезают. Позиция пересчитывается при scroll,
resize и изменении размеров anchor или панели; поддерживаются viewport clamp и placement flip.

В браузерах без Popover API панель временно переносится в `document.body`. Перед переносом controller
сохраняет вычисленные `--alt-*` theme properties, а при закрытии, abort или disconnect возвращает панель на
точное место в light DOM. Состояние `open`, ARIA, события, focus restoration и выбор значений остаются
ответственностью конкретного компонента.

`alt-dialog` и `alt-drawer` не используют anchored-overlay lifecycle. Modal behavior, backdrop, focus
containment и top layer обеспечивает native `<dialog>.showModal()`, а общий native-dialog controller
синхронизирует dismiss и восстановление фокуса. `alt-drawer` добавляет к этому четыре placement и общий
swipe-dismiss behavior; `left/right` используются как Drawer, `top/bottom` — как мобильные Sheet.

Открытые из Dialog или Drawer popup-панели всё равно попадают в top layer поверх modal. Мобильные шторки
Date Picker и Date Range Picker повторно используют тот же swipe-dismiss controller, но остаются частью
Date Picker и не вкладывают публичный `<alt-drawer>`.

`alt-dropdown` — только listbox content и может использоваться как внутри Popup/Autocomplete, так и
самостоятельно. Он не владеет позиционированием или dismiss lifecycle.
