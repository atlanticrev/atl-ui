# План стабилизации ATL UI Vanilla

Этот файл — рабочий план превращения `@atlanticrev/atl-ui-vanilla` из feature-ветки в стабильный
продукт. После каждого завершённого шага здесь нужно обновлять статус, дату и подтверждение результата.

Статусы: `✅ выполнено`, `🟡 в работе`, `⬜ запланировано`, `⛔ заблокировано`.

## Состояние на 22 июля 2026 года

- В vanilla-каталоге поддерживаются 32 компонента и CSS-рецепта.
- Публичная версия пакета в репозитории пока `0.1.0`; следующий релиз планируется как `0.2.0`.
- Ветка `feat/atl-ui-vanilla` на 17 коммитов впереди `origin/main`.
- Тег `atl-ui-vanilla-v0.1.0` на 9 коммитов позади текущего `HEAD`.
- Production-каталог: <https://atl-ui.vercel.app/storybook.html>.
- React-пакет сохраняется без breaking changes; автоматическая полная parity с vanilla не является целью.

## 1. Закрыть текущую итерацию

- ✅ Использовать новый Search в шапке demo, проверить, закоммитить, запушить и задеплоить.
  Подтверждение: commit `6d3dc8c`, production-каталог отвечает и прошёл Chrome smoke-check.
- ✅ Актуализировать package roadmap и migration matrix по фактическим 32 позициям каталога.
  Подтверждение: [`roadmap.md`](packages/atl-ui-vanilla/docs/roadmap.md) и
  [`migration-matrix.md`](packages/atl-ui-vanilla/docs/migration-matrix.md).
- ✅ Зафиксировать поддерживаемые компоненты, custom elements, entry points, CSS и инфраструктурный API.
  Подтверждение: [`public-api.md`](packages/atl-ui-vanilla/docs/public-api.md).
- ✅ Устранить блокировку корневого demo при upgrade декларативного Select и добавить постоянный smoke-gate.
  Подтверждение: `npm run verify:vanilla` — 183 unit-теста, 105 browser-тестов и package build прошли.

Результат этапа: массовый перенос компонентов завершён; дальнейшая работа идёт от релизных и реальных
продуктовых сценариев.

## 2. Подготовить релиз 0.2.0

- ⬜ Добавить CI на каждый push и pull request. Минимальный gate: lint, format check, typecheck, unit tests,
  browser tests, package build и demo build.
- ⬜ Собрать tarball и установить его в чистый временный consumer project.
- ⬜ Проверить корневой импорт, все точечные JS entry points и три CSS entry points.
- ⬜ Проверить SSR-safe import, отсутствие auto-registration и отсутствие runtime dependencies.
- ⬜ Обновить root README, package README и release notes для `0.2.0`.
- ⬜ Проверить publish workflow и публикацию в GitHub Packages. Локальная registry-проверка требует
  валидный токен; секрет нельзя сохранять в репозитории или логах.
- ⬜ Поднять версию пакета до `0.2.0` только после прохождения release gate.

Почему minor: после `0.1.0` появились Calendar, Date Picker, Date Range Picker, Search, Pagination, Menu,
общий overlay controller и другие публичные возможности.

## 3. Влить ветку в main и выпустить релиз

- ⬜ Убедиться, что `feat/atl-ui-vanilla` синхронизирована с актуальным `main`.
- ⬜ Влить ветку в `main` через обычный review/merge flow репозитория.
- ⬜ Повторить release gate на merge commit.
- ⬜ Создать и запушить тег `atl-ui-vanilla-v0.2.0`.
- ⬜ Подтвердить успешную публикацию пакета и проверить устанавливаемый artifact.

## 4. Подключить библиотеку в social-video-posting

- ⬜ Выбрать один реальный экран с Input, Select, Autocomplete и календарями.
- ⬜ Подключить только нужные entry points; не использовать `define-all` в production flow.
- ⬜ Перенести форму и проверить submit, reset, validation и сериализацию FormData.
- ⬜ Проверить клавиатуру, focus restore, мобильную версию и top-layer overlays.
- ⬜ Зафиксировать найденные пробелы публичного API и закрывать только подтверждённые сценарии.
- ⬜ Мигрировать остальные экраны постепенно, без массовой переписи.

## 5. Измерить производительность после интеграции

- ⬜ Измерить реально загруженные JS и CSS и проверить tree shaking.
- ⬜ Снять parse/evaluate, long tasks и использование памяти.
- ⬜ Снять LCP, INP и CLS на production-сборке приложения.
- ⬜ Сравнить эквивалентные React- и vanilla-экраны на одинаковом сценарии и окружении.
- ⬜ Обновить [`bundle-baseline.md`](packages/atl-ui-vanilla/docs/bundle-baseline.md) фактическими данными.

## 6. Дальнейшее развитие

- ⬜ Добавлять компоненты только под подтверждённые сценарии приложения.
- ⬜ Не переносить React API буквально, если browser-native контракт проще и надёжнее.
- ⬜ Не вводить обязательную полную parity React и vanilla.
- ⬜ Сохранять React-пакет обратно совместимым, пока отдельное breaking change явно не согласовано.

## Журнал актуализации

| Дата | Этап | Результат |
|---|---|---|
| 2026-07-22 | Закрытие текущей итерации | Search опубликован; roadmap, migration matrix и public API приведены к фактическому состоянию |
| 2026-07-22 | Стабилизация demo | Устранён render-loop Select; корневая страница добавлена в browser smoke-gate |
