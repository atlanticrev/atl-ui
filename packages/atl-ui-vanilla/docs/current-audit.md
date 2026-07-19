# Аудит React-пакета

## Что существует сейчас

- Публичный пакет `@atlanticrev/atl-ui` остаётся без переименования и breaking changes.
- Публично экспортируются 22 UI-компонента.
- `combobox`, `circle-icon` и showcase — внутренние модули.
- 91 исходный файл напрямую зависит от React или React DOM.
- В это число входят SVG-иконки, stories и form bindings.
- `tsup` выпускает ESM entry points `.` и `./forms`.
- Sass выпускает отдельные `core`, `theme` и `default` CSS.
- Storybook работает через React/Vite; найдено 24 stories.
- Есть восемь test-файлов: пять для компонентов и три для forms.
- Покрытие keyboard, accessibility и lifecycle неполное.
- Runtime peer dependencies — React и React DOM.
- Остальные зависимости используются только при разработке.

## React-механизмы, которые нельзя переносить буквально

- `ToastProvider` и form provider используют Context.
- Vanilla заменяет их DOM region и обычными объектами или store.
- `Popup` и `Modal` используют portals.
- Vanilla предпочитает Popover API и `<dialog>` в документе.
- Select и Autocomplete делят hooks для state, filtering, selection и keyboard.
- Input измеряет label и outline через hooks и `ResizeObserver`.
- Vanilla Input хранит native input в owned light DOM.
- Table принимает render callbacks; их должен выполнять код приложения.
- Библиотека даёт таблице semantic markup contract и CSS recipe.
- ReactNode props нельзя сериализовать в attributes.
- Их замена — authored light DOM или конкретные `Node` properties.
- Controlled props заменяются properties и `alt-*` events.
- Boolean и string настройки отражаются attributes.

## Стили и темы

Исходная палитра и визуальные состояния переносимы. Новый CSS использует `--alt-*`, классы
`alt-component__part` и слои `alt.reset`, `alt.tokens`, `alt.components`, `alt.utilities`,
`alt.overrides`. Shadow DOM не используется. Поэтому темы, локальные overrides и существующий
cascade продолжают работать.

## Формы и accessibility

Input и file controls сохраняют настоящий `<input>`. Select показывает кастомный listbox, но отправляет
значение через скрытый `<select>`. Checkbox, radio и switch остаются native inputs. Поэтому FormData,
reset, constraint validation, autofill и browser accessibility не требуют отдельного form runtime.

## SSR

Импорт entry points не читает browser globals. Native recipes сразу дают полезную server markup. Owned
elements могут гидрировать только размеченные `data-alt-owned` части. Неизвестный DOM не считается
внутренним. Без SSR приложение отдаёт custom-element attributes и регистрирует элементы на клиенте.
