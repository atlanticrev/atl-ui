# Native recipes

Эти компоненты не регистрируют custom elements: браузер уже реализует нужные semantics, keyboard и forms.
Приложение владеет их разметкой, а пакет даёт namespaced CSS-контракт.

| React component | Native contract | State contract |
|---|---|---|
| `AtlButton` | `button.alt-button` или `a.alt-button` | `data-variant`, `data-tone`, `data-size` |
| `AtlCard` | `article.alt-card` или `section.alt-card` | `data-variant="flat|soft"` |
| `AtlBreadcrumbs` | `nav.alt-breadcrumbs > ol.alt-breadcrumbs__list` | `aria-current="page"` |
| `AtlCheckbox` | `label.alt-checkbox > input[type=checkbox].alt-checkbox__control` | Native control state |
| `AtlRadioButton` | `label.alt-radio > input[type=radio].alt-radio__control` | Native grouping/state |
| `AtlSwitcher` | `label.alt-switcher > input[type=checkbox].alt-switcher__control` | `role="switch"` |
| `AtlChip` | `span.alt-chip`, actionable `button.alt-chip` и optional `button.alt-button.alt-chip__remove` | `data-size`, `data-variant` |
| `AtlSkeleton` | `span.alt-skeleton` | `data-shape="line|rect|circle|overlay"` |
| `AtlSidebar` | `aside.alt-sidebar` с native links/buttons | `data-collapsed`, `aria-current` |

## Form controls

```html
<label class="alt-checkbox">
  <input class="alt-checkbox__control" name="published" type="checkbox" />
  <span>Published</span>
</label>

<label class="alt-switcher">
  <input class="alt-switcher__control" name="crosspost" role="switch" type="checkbox" />
  <span>Cross-post automatically</span>
</label>
```

`indeterminate` у checkbox задаётся property: `input.indeterminate = true`. События остаются native
`input`/`change`; значения автоматически попадают в `FormData`, работают reset, autofill и validation.

## Authored composition

Breadcrumbs и sidebar не принимают массив данных: приложение создаёт links/buttons само. Это сохраняет
router integration и не требует внутреннего renderer. Skeleton overlay кладётся рядом с реальным контентом
в `.alt-skeleton-wrapper`; placeholder получает `aria-hidden="true"`.

Actionable chip — настоящий `button.alt-chip` с visible focus и native keyboard semantics. Chip remove —
icon-only `button.alt-button.alt-chip__remove` с доступным именем; Button recipe отвечает за общие hover,
focus и disabled states. Disabled chip должен поставить `aria-disabled="true"` на контейнер и `disabled` на
remove button. Card сохраняет выбранный semantic tag приложения.
