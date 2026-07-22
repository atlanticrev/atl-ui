# План развития ATL UI Vanilla

Этот файл содержит только актуальные задачи после релиза `@atlanticrev/atl-ui-vanilla@0.2.0`.
Выполненные этапы удаляются отсюда: история изменений хранится в Git и
[`release notes`](packages/atl-ui-vanilla/docs/releases/0.2.0.md).

## Текущее состояние

- В пакете поддерживаются 33 компонента и CSS-рецепта, включая единый Drawer/Sheet с четырьмя направлениями.
- Dialog и Drawer используют общий native-modal lifecycle; Drawer и мобильные календарные шторки — общий
  swipe-dismiss механизм без runtime dependencies.
- `0.2.0` опубликован в GitHub Packages и отмечен как latest.
- Release tag: `atl-ui-vanilla-v0.2.0`.
- Кандидат `0.3.0` добавляет публичный Drawer/Sheet и готовится к публикации.
- Пакет приватный; приложению-потребителю потребуется доступ к GitHub Packages.
- Production-каталог: <https://atl-ui.vercel.app/storybook.html>.
- React- и vanilla-пакеты остаются независимо подключаемыми.

## 1. Подключить библиотеку в social-video-posting

- ⬜ Выбрать один реальный экран с Input, Select, Autocomplete и календарями.
- ⬜ Настроить приложению доступ к приватному пакету без хранения токена в репозитории.
- ⬜ Подключить только используемые JS entry points и CSS; не использовать `define-all` в production flow.
- ⬜ Перенести форму и проверить submit, reset, validation и сериализацию `FormData`.
- ⬜ Проверить клавиатуру, focus restore, мобильную версию и top-layer overlays.
- ⬜ Зафиксировать реальные пробелы публичного API и закрывать только подтверждённые сценарии.
- ⬜ Мигрировать остальные экраны постепенно, без массовой переписи.

## 2. Измерить производительность после интеграции

- ⬜ Измерить реально загруженные JS и CSS и проверить tree shaking.
- ⬜ Снять parse/evaluate, long tasks и использование памяти.
- ⬜ Снять LCP, INP и CLS на production-сборке приложения.
- ⬜ Сравнить эквивалентные React- и vanilla-экраны на одинаковом сценарии и окружении.
- ⬜ Обновить
  [`bundle-baseline.md`](packages/atl-ui-vanilla/docs/bundle-baseline.md) фактическими данными.

## 3. Развивать библиотеку от реальных потребностей

- ⬜ Добавлять компоненты только под подтверждённые сценарии приложения.
- ⬜ Не переносить React API буквально, если browser-native контракт проще и надёжнее.
- ⬜ Не вводить обязательную полную parity React и vanilla.
- ⬜ Сохранять zero-runtime-dependency, light DOM, SSR-safe imports и независимые entry points.
- ⬜ Сохранять React-пакет обратно совместимым, пока breaking change явно не согласован.
