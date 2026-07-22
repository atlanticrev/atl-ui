# План стабилизации ATL UI Vanilla

Этот файл — рабочий план превращения `@atlanticrev/atl-ui-vanilla` из feature-ветки в стабильный
продукт. После каждого завершённого шага здесь нужно обновлять статус, дату и подтверждение результата.

Статусы: `✅ выполнено`, `🟡 в работе`, `⬜ запланировано`, `⛔ заблокировано`.

## Состояние на 22 июля 2026 года

- В vanilla-каталоге поддерживаются 32 компонента и CSS-рецепта.
- Версия пакета в репозитории подготовлена как `0.2.0`; публикация в GitHub Packages ещё не выполнена.
- Ветка `feat/atl-ui-vanilla` на 24 коммита впереди `origin/main`.
- Тег `atl-ui-vanilla-v0.1.0` на 16 коммитов позади текущего `HEAD`.
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
  Подтверждение: `npm run verify:vanilla` — 183 unit-теста, 111 browser-тестов и package build прошли.

Результат этапа: массовый перенос компонентов завершён; дальнейшая работа идёт от релизных и реальных
продуктовых сценариев.

## 2. Подготовить релиз 0.2.0

- ✅ Добавить ежедневный ночной CI с ручным запуском. Gate проверяет root и vanilla lint/typecheck/unit/build,
  vanilla format, 111 browser tests и production demo build; автоматически запускается в `01:30 UTC`.
  Подтверждение:
  [`.github/workflows/ci.yml`](.github/workflows/ci.yml) и успешный локальный прогон эквивалентных команд.
- ✅ Собрать tarball и установить его в чистый временный consumer project.
- ✅ Проверить корневой импорт, все точечные JS entry points и три CSS entry points.
- ✅ Проверить SSR-safe import, отсутствие auto-registration, отсутствие runtime dependencies и границу
  tree shaking на Input-only production build. Подтверждение: `npm run verify:vanilla:consumer`; gate подключён
  к CI и publish workflow.
- ✅ Обновить root README, package README и release notes для `0.2.0`. Подтверждение:
  [`README.md`](README.md), [`package README`](packages/atl-ui-vanilla/README.md) и
  [`release notes`](packages/atl-ui-vanilla/docs/releases/0.2.0.md).
- ✅ Убрать автоматическую публикацию по тегу и подготовить безопасную ручную команду с preflight,
  release gate и проверкой registry. Подтверждение: `npm run publish:vanilla` и
  [`releasing.md`](packages/atl-ui-vanilla/docs/releasing.md).
- ✅ Поднять package metadata, публичную version constant и regression test до `0.2.0`.
- ⬜ Выполнить публикацию в GitHub Packages с personal access token владельца; секрет нельзя сохранять в
  репозитории или логах.

Почему minor: после `0.1.0` появились Calendar, Date Picker, Date Range Picker, Search, Pagination, Menu,
общий overlay controller и другие публичные возможности.

## 3. Влить ветку в main и выпустить релиз

- ⬜ Убедиться, что `feat/atl-ui-vanilla` синхронизирована с актуальным `main`.
- ⬜ Влить ветку в `main` через обычный review/merge flow репозитория.
- ⬜ Повторить release gate на merge commit.
- ⬜ Вручную опубликовать пакет командой `npm run publish:vanilla`.
- ⬜ Подтвердить успешную публикацию и проверить устанавливаемый artifact.
- ⬜ После успешной публикации создать и запушить тег `atl-ui-vanilla-v0.2.0`.

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
| 2026-07-22 | Подготовка 0.2.0 | Добавлен полный quality/build/browser CI и release gate |
| 2026-07-22 | Consumer release-gate | Tarball проверен в чистом проекте; JS/CSS imports, SSR и tree shaking автоматизированы |
| 2026-07-22 | Стабилизация CI | Визуальные эталоны разделены по ОС; WebKit focus-check ожидает применение стиля вместо чтения переходного состояния |
| 2026-07-22 | Документация 0.2.0 | Root/package README актуализированы; release notes описывают новый API, upgrade и release gate |
| 2026-07-22 | Стабилизация accessibility CI | Dialog, Tooltip и Toast axe-аудиты разделены на независимые тесты с отдельными timeout budgets |
| 2026-07-22 | Расписание CI | Тяжёлый полный gate перенесён с каждого push/PR на ежедневный запуск в 01:30 UTC; ручной запуск сохранён |
| 2026-07-22 | Подготовка публикации 0.2.0 | Версия поднята; автопубликация по тегу заменена безопасной локальной командой с preflight и release gate |
