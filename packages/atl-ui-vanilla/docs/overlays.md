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
синхронизирует dismiss, восстановление фокуса и reference-counted блокировку прокрутки документа. Backdrop
занимает `100dvh`, поэтому следует за реальной видимой высотой Android-браузера при появлении и скрытии его
нативной панели. `alt-drawer` добавляет к этому четыре placement и общий swipe-dismiss behavior;
`left/right` используются как Drawer, `top/bottom` — как мобильные Sheet. `alt-dialog` и его backdrop
открываются и закрываются общей 250 ms анимацией с поддержкой `prefers-reduced-motion`.

Открытые из Dialog или Drawer popup-панели всё равно попадают в top layer поверх modal. Мобильные шторки
Date Picker и Date Range Picker повторно используют тот же swipe-dismiss controller, но остаются частью
Date Picker и не вкладывают публичный `<alt-drawer>`. Пока такая шторка открыта, она использует тот же
document scroll lock, что Dialog и Drawer.

`alt-dropdown` — только listbox content и может использоваться как внутри Popup/Autocomplete, так и
самостоятельно. Он не владеет позиционированием или dismiss lifecycle.

Обычные `alt-popup` и `alt-tooltip` намеренно не блокируют страницу: это немодальные подсказки. Popup уже
владеет рамкой, фоном и тенью; для стандартных внутренних отступов authored content получает класс
`.alt-popup__content` и может настраивать `--alt-popup-padding`. Tooltip переопределяет браузерный
`overflow: auto` для элементов с `popover`, поэтому у короткой подсказки не появляется лишняя полоса
прокрутки.
