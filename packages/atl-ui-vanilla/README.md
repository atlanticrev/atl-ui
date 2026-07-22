# @atlanticrev/atl-ui-vanilla

Framework-independent Atlantic Review UI на light DOM и browser APIs. У пакета нет runtime dependencies,
auto-registration, Shadow DOM, renderer или Virtual DOM.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAllAltElements } from '@atlanticrev/atl-ui-vanilla/define-all';

defineAllAltElements();
```

Можно импортировать только нужный entry point, например `@atlanticrev/atl-ui-vanilla/alert`. Вызовы
`define*` идемпотентны. Импорт и вызов регистрации на сервере безопасны; без browser environment define
вернёт `undefined`.

## SVG icons

Иконки не зависят от шрифтов и доступны отдельным tree-shakeable entry point:

```ts
import { createAltIcon } from '@atlanticrev/atl-ui-vanilla/icons';

button.append(createAltIcon(document, 'plus', { size: 20 }));
```

Для server markup используйте `altIconMarkup('check')`. Встроенные иконки Select, Autocomplete,
Dropdown и Toast создаются автоматически как доступные декоративные `<svg>`.

Компоненты не привязаны к этому набору. У всех внутренних и authored icon-позиций есть замена через
обычный DOM `Node`: включая actions Autocomplete, leading/indicator Select, option/check icons,
Toast/dismiss, File upload и пагинацию Table. Полная матрица и семантика `undefined`/`null` описаны в
[`docs/icons.md`](docs/icons.md).

## Native recipes

Контракты кнопки, loading, иконок, native form controls и authored composition описаны в
[`docs/button.md`](docs/button.md) и [`docs/native-recipes.md`](docs/native-recipes.md).

```html
<button class="alt-button" data-size="40" data-variant="filled" type="button">Publish</button>
<article class="alt-card">...</article>
<label class="alt-checkbox">
  <input class="alt-checkbox__control" name="terms" type="checkbox" />
  <span class="alt-checkbox__label">Accept terms</span>
</label>
```

## Managed и compound components

```html
<form id="post-form">
  <alt-input helper-text="Required" label="Title" name="title" required></alt-input>
  <alt-select label="Channel" name="channel" required>
    <alt-option label="YouTube" value="youtube"></alt-option>
    <alt-option label="TikTok" value="tiktok"></alt-option>
  </alt-select>
</form>
```

```ts
const input = document.querySelector('alt-input');
input.value = 'Launch';
input.addEventListener('alt-input', (event) => console.log(event.detail.value));

const select = document.querySelector('alt-select');
select.options = [{ label: 'Instagram', value: 'instagram' }];
select.addEventListener('alt-change', (event) => console.log(event.detail.values));
```

Input держит настоящий `<input>` внутри light DOM. Select принимает авторский trigger и rich option content,
но использует скрытый native `<select>` как carrier для FormData, reset и validation:

```html
<alt-select label="Channel">
  <button class="alt-button" data-alt-select-trigger type="button">
    <span data-alt-select-value>Choose channel</span>
    <span aria-hidden="true" data-alt-select-indicator>⌄</span>
  </button>
  <alt-option value="youtube"><strong>YouTube</strong><small>Public video</small></alt-option>
</alt-select>

<alt-autocomplete free-solo label="Tool" multiple>
  <input data-alt-autocomplete-input type="search" />
  <button data-alt-autocomplete-trigger type="button">Browse tools</button>
</alt-autocomplete>
```

Повторный click по trigger закрывает popup. `alt-before-open-change` можно отменить, а
`alt-open-change`, `alt-input` и `alt-change` содержат причину и исходное browser event. Полный контракт
Select и Autocomplete описан в [`docs/select-autocomplete.md`](docs/select-autocomplete.md).

Отдельные tree-shakeable entry points также доступны для `alert`, `avatar`, `calendar`, `date-picker`,
`collapse`, `menu`, `pagination`, `search`, `file-upload`, `progress`, `popup`, `tooltip`, `dialog`, `dropdown`,
`autocomplete` и `table`. Ни один entry point не регистрируется сам. Контракты календарей и новых компонентов
описаны в [`docs/calendar.md`](docs/calendar.md) и
[`docs/additional-components.md`](docs/additional-components.md).

## Alert, Tabs и Toast

Inline feedback через Alert отделён от временных Toast-уведомлений. Полный API severity, variants,
custom actions/icons и cancelable close event описан в [`docs/alert.md`](docs/alert.md).

```html
<alt-alert dismissible severity="warning" variant="outlined">
  <strong class="alt-alert__title">Schedule conflict</strong>
  This post overlaps another publication.
</alt-alert>
```

Полный контракт очереди, lifecycle, таймеров и события закрытия описан в
[`docs/toast.md`](docs/toast.md).

```html
<alt-tabs active-key="drafts">
  <div role="tablist">
    <button data-key="drafts" role="tab">Drafts</button>
    <button data-key="published" role="tab">Published</button>
  </div>
  <section data-key="drafts" role="tabpanel">...</section>
  <section data-key="published" role="tabpanel">...</section>
</alt-tabs>

<alt-toast-region></alt-toast-region>
```

```ts
document.querySelector('alt-toast-region').push({
  message: 'Post published',
  status: 'success',
});
```

## Темы и overrides

`core.css` содержит tokens, `theme.css` — recipes, `default.css` — оба слоя. Тема выбирается через
`data-alt-theme="light|dark"`. Локальные изменения помещаются после library CSS или в предусмотренный
слой:

```css
@layer alt.overrides {
  .alt-button[data-variant='filled'] {
    --alt-button-bg: #141414;
    --alt-button-bg-hover: #2b2b2b;
    --alt-button-bg-active: #050505;
  }
}
```

Поддерживается актуальный evergreen browser baseline. Popover API и CSS Anchor Positioning используются
как progressive enhancement; dismiss и вычисляемое positioning имеют browser-API fallback.

## Визуальная проверка

Чистая HTML/TypeScript-витрина не использует React или Storybook runtime:

```sh
npm run demo --workspace @atlanticrev/atl-ui-vanilla
```

Полный dependency-free Storybook со всеми компонентами, вариантами и состояниями:

```bash
npm run storybook --workspace @atlanticrev/atl-ui-vanilla
```

Каталог откроется на `/storybook.html`. В нём есть поиск, навигация, light/dark theme и раскрываемый
HTML каждого примера.

Пилот доступен на `/`, showcase компонентов — на `/components.html`.

Production-вариант собирается командой
`npm run demo:build --workspace @atlanticrev/atl-ui-vanilla`.

Полный quality gate пакета проверяет lint, форматирование, типы, unit/browser tests и
production build:

```bash
npm run verify:vanilla
```

`npm run format --workspace @atlanticrev/atl-ui-vanilla` сначала нормализует blank lines через
`atl-formatter`, затем применяет Biome ко всему пакету.

Для установки dev dependencies задайте `GITHUB_TOKEN` в том же shell, где запускается npm. Нужен
GitHub PAT classic с `read:packages` и доступом к `atlanticrev/atl-formatter`; fine-grained PAT для
GitHub Packages npm registry не поддерживается.

Полный browser- и accessibility-набор запускается в Chromium, Firefox и WebKit:

```bash
npm run test:browser --workspace @atlanticrev/atl-ui-vanilla
```

Архитектура, аудит и порядок миграции описаны в `docs/`.
