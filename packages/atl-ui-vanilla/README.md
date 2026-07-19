# @atlanticrev/atl-ui-vanilla

Framework-independent Atlantic Review UI на light DOM и browser APIs. У пакета нет runtime dependencies,
auto-registration, Shadow DOM, renderer или Virtual DOM.

## Подключение

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import {
  defineAltInput,
  defineAltSelect,
  defineAltTabs,
  defineAltToastRegion,
} from '@atlanticrev/atl-ui-vanilla';

defineAltInput();
defineAltSelect();
defineAltTabs();
defineAltToastRegion();
```

Можно импортировать только нужный entry point, например `@atlanticrev/atl-ui-vanilla/input`. Вызовы
`define*` идемпотентны. Импорт и вызов регистрации на сервере безопасны; без browser environment define
вернёт `undefined`.

## Native recipes

Полный контракт кнопки, loading, иконки, tones и группы описаны в
[`docs/button.md`](docs/button.md).

```html
<button class="alt-button" data-size="40" data-variant="filled" type="button">Publish</button>
<article class="alt-card">...</article>
<label class="alt-checkbox">
  <input class="alt-checkbox__control" name="terms" type="checkbox" />
  <span class="alt-checkbox__label">Accept terms</span>
</label>
```

## Input и Select

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

Input держит настоящий `<input>` внутри light DOM. Select полностью управляет видимыми trigger/listbox,
но использует скрытый native `<select>` как carrier для FormData, reset и validation.

## Tabs и Toast

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

Чистая HTML/TypeScript-витрина пилотных компонентов не использует React или Storybook runtime:

```sh
npm run demo --workspace @atlanticrev/atl-ui-vanilla
```

Production-вариант собирается командой
`npm run demo:build --workspace @atlanticrev/atl-ui-vanilla`.

Архитектура, аудит и порядок миграции описаны в `docs/`.
