# Accessibility baseline

Компоненты используют нативные элементы и light DOM.
Семантика доступна браузеру и assistive technologies
без специальных Shadow DOM-мостов.

## Автоматическая проверка

Playwright запускает один набор в Chromium, Firefox и WebKit.
Axe проверяет WCAG 2 A/AA и WCAG 2.1 A/AA для:

- всех статических состояний каталога;
- открытых Select и Autocomplete;
- открытых Dialog и Tooltip;
- показанного Toast.

```sh
npm run test:browser --workspace @atlanticrev/atl-ui-vanilla
```

## Контракты

- Dropdown переносит имя host-элемента на owned `role="listbox"`.
- Горизонтальная область Table имеет `role="region"`, имя и `tabindex="0"`.
- Loading spinner внутри Button декоративный.
  Состояние сообщает кнопка через `aria-busy="true"`.
- Skeleton Host сообщает loading через `aria-busy`, а content временно получает `aria-hidden` и `inert`.
- Skeleton shimmer и fade отключаются при `prefers-reduced-motion: reduce`.
- Текстовые success/danger tokens проходят минимальный контраст WCAG AA.
- Focus, keyboard selection, dismiss и focus restore покрыты browser-тестами.

Автоматический аудит не заменяет проверку экранным диктором.
Перед стабильным `1.0` нужны сценарии VoiceOver для форм,
combobox, dialog и live-region уведомлений в реальном приложении.
