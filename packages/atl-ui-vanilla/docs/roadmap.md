# Пошаговая реализация

## Пакеты

- `@atlanticrev/atl-ui` — текущая React-библиотека без breaking changes.
- `@atlanticrev/atl-ui-vanilla` — zero-dependency browser package.

## Этапы

1. Зафиксировать visual/API baseline и публиковать пакеты независимыми версиями.
2. Выпустить core: lifecycle, converters, batching, events, registration и controllers.
3. Проверить pilot: Button/Card/Checkbox recipes, Input, Select, Tabs и Toast region.
4. Подключить pilot напрямую в одном native production flow `social-video-posting`.
5. Перенести остальные native recipes, затем FileUpload, Progress и Avatar.
6. Перенести Popup, Tooltip и Dialog; проверить stacking, focus restore и mobile viewport.
7. Перенести Dropdown и Autocomplete.
8. Table и Sidebar оставить author-rendered до подтверждённой потребности.
9. Переписать `social-video-posting` route за route на native TypeScript.
10. После parity снять Chrome traces: gzip, parsed JS, long tasks, INP/LCP/CLS и memory.

## Pilot gate

Массовая миграция начинается только если pilot подтверждает:

- SSR-safe imports и отсутствие auto-registration;
- form submit, reset и validation без React;
- pre-upgrade properties и reconnect cleanup;
- keyboard, focus и a11y в Chromium, Firefox и WebKit;
- light/dark palette и overrides без Shadow DOM;
- component entry points действительно tree-shakeются;
- прямое DOM-подключение не дублирует listeners при reconnect;
- controlled и uncontrolled semantics предсказуемы.

## Граница vanilla DOM

DOM создаётся один раз, затем меняются text, attributes и state classes. Select и Toast используют
маленький keyed алгоритм для десятков элементов. Тысячи строк, virtualization, arbitrary render callbacks,
editable trees и cross-row reconciliation остаются ответственностью приложения.
