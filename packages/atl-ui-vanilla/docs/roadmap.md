# Roadmap ATL UI Vanilla

## Текущее состояние

Массовый перенос компонентов завершён. Каталог содержит 33 поддерживаемые позиции: 21 категорию managed
или behavioral компонентов и 12 native CSS recipes. Полный список и публичные entry points зафиксированы в
[`public-api.md`](public-api.md), соответствие React и vanilla — в
[`migration-matrix.md`](migration-matrix.md).

Завершены:

- core lifecycle, converters, batching, typed events и idempotent registration;
- form carrier, selection, dismissal, focus, positioning, open-state и typeahead controllers;
- Input, Select, Autocomplete и native form integration;
- Calendar, Date Picker и Date Range Picker со всеми календарными view и presets;
- Popup, Tooltip, Dialog, Drawer/Sheet и общий top-layer overlay contract;
- Menu, Dropdown, Pagination, Table, Search, Alert и Toast;
- native recipes, иконки, demo-каталог, accessibility и browser regression coverage.

## Следующий продуктовый этап

Подключить пакет в одном реальном экране `social-video-posting`:

- импортировать только нужные component entry points, не `define-all`;
- начать с формы, использующей Input, Select, Autocomplete и календарь;
- проверить submit, reset, validation, mobile layout и overlays;
- зафиксировать реальные пробелы API до миграции следующих экранов.

После интеграции нужно измерить production JS/CSS, tree shaking, parse/evaluate, long tasks, memory и Web
Vitals, а затем сравнить эквивалентные React- и vanilla-сценарии.

## Принципы дальнейшей работы

- Новые компоненты добавляются только под подтверждённую потребность приложения.
- React-пакет сохраняется без breaking changes.
- Полная автоматическая parity React и vanilla не требуется.
- ReactNode/render callback API не переносится в string attributes.
- Editable и virtualized data grids остаются ответственностью приложения.
- Vanilla-пакет сохраняет zero-runtime-dependency, light DOM и независимые SSR-safe entry points.

Полный межпакетный план со статусами ведётся в корневом
[`VANILLA_PRODUCT_PLAN.md`](../../../VANILLA_PRODUCT_PLAN.md).
