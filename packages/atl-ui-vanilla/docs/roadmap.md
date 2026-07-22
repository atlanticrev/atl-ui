# Roadmap ATL UI Vanilla

## Текущее состояние

Массовый перенос компонентов завершён. Каталог содержит 32 поддерживаемые позиции: 20 категорий managed
или behavioral компонентов и 12 native CSS recipes. Полный список и публичные entry points зафиксированы в
[`public-api.md`](public-api.md), соответствие React и vanilla — в
[`migration-matrix.md`](migration-matrix.md).

Завершены:

- core lifecycle, converters, batching, typed events и idempotent registration;
- form carrier, selection, dismissal, focus, positioning, open-state и typeahead controllers;
- Input, Select, Autocomplete и native form integration;
- Calendar, Date Picker и Date Range Picker со всеми календарными view и presets;
- Popup, Tooltip, Dialog и общий top-layer overlay contract;
- Menu, Dropdown, Pagination, Table, Search, Alert и Toast;
- native recipes, иконки, demo-каталог, accessibility и browser regression coverage.

## Ближайшая цель: релиз 0.2.0

1. ✅ Ежедневный ночной CI добавлен: quality/build и browser gates запускаются в `01:30 UTC`, также доступен ручной запуск.
2. ✅ Собранный tarball устанавливается и собирается в чистом consumer project.
3. ✅ Корневой и точечные JS/CSS imports, SSR safety и tree shaking boundaries входят в release-gate.
4. ✅ Root/package README и release notes для `0.2.0` обновлены.
5. ✅ Версия `0.2.0` и безопасная ручная публикация в GitHub Packages подготовлены.
6. ✅ `feat/atl-ui-vanilla` влита в `main`, release gate повторно прошёл на merge commit.
7. ✅ Пакет `0.2.0` опубликован и проверен; `atl-ui-vanilla-v0.2.0` создан на release commit.

Это minor release: после `0.1.0` появились новые публичные компоненты, календари и инфраструктурные
возможности. Breaking changes в существующих контрактах не планируются.

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
