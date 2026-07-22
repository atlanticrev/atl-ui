# Пользовательские иконки

Все иконки являются обычными light-DOM узлами. Компоненты принимают `SVGElement`, `HTMLImageElement`
или другой `Node`, поэтому приложение не привязано к встроенному набору ATL UI.

```ts
const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
select.indicatorIcon = icon;
```

Один DOM-узел может находиться только в одном месте. Для нескольких экземпляров создавайте отдельный
SVG или используйте небольшую фабрику `createMyIcon()`.

## Контракты компонентов

| Компонент | Точки расширения |
| --- | --- |
| Alert | `icon`, `iconMapping`, `closeIcon`, authored `[data-alt-alert-icon]` |
| Button | `.alt-button__icon`; дочерний узел `.alt-button__loading-indicator` |
| Input | `leadingIcon`, `trailingIcon` |
| Select | `leadingIcon`, `indicatorIcon`, `options[].icon`, `options[].checkIcon`, authored trigger |
| Autocomplete | `indicatorIcon`, `clearIcon`, `noResultsIcon`, icons опций, authored actions |
| Dropdown | `emptyIcon`, `options[].icon`, `options[].checkIcon` |
| Toast | `options.icon`, `options.dismissIcon` |
| Avatar | `icon` |
| File upload | `buttonIcon` |
| Table | `previousIcon`, `nextIcon`; любой Node в title, cell и empty content |
| Progress | любой Node через `labelContent` |
| Tooltip | любой Node через `content` и внутри authored trigger |
| Breadcrumbs | любой SVG внутри `.alt-breadcrumbs__separator` |
| Chip | любой SVG внутри `.alt-button.alt-chip__remove` или рядом с label |
| Dialog | любой SVG внутри authored `.alt-button[data-alt-dialog-close]` |
| Sidebar | любой SVG внутри authored `.alt-sidebar__item` |
| Tabs | любой SVG внутри authored `[role="tab"]` |

Checkbox, Radio и Switcher используют CSS-маркеры состояния, а не контентные иконки. Их внешний вид
настраивается tokens/overrides; нативные input и их семантика сохраняются.

## Встроенный fallback

У `Alert.icon`, `Alert.closeIcon`, `Select.indicatorIcon`, action-иконок Autocomplete,
`options[].checkIcon`, `Toast.icon` и `Toast.dismissIcon` есть встроенные fallback SVG:

- `undefined` оставляет или восстанавливает fallback;
- пользовательский `Node` заменяет fallback;
- `null` скрывает графику, не удаляя доступную кнопку или ARIA-семантику.

У точек без встроенной иконки (`leadingIcon`, `emptyIcon`, `buttonIcon` и подобных) `null` означает
отсутствие иконки.

Полностью авторские triggers/actions библиотека не перезаписывает: их содержимым всегда владеет
приложение.
