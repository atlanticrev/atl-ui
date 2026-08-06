# ATL UI

Репозиторий содержит две независимо подключаемые UI-библиотеки Atlantic Rev:

| Пакет | Назначение | Runtime-контракт |
|---|---|---|
| `@atlanticrev/atl-ui` | React-компоненты и headless forms | React 18 или 19 как peer dependency |
| `@atlanticrev/atl-ui-vanilla` | Light DOM Web Components и native CSS recipes | Ноль runtime dependencies |

Vanilla-пакет не зависит от React и не является скрытой частью React-сборки. Его актуальный продуктовый
план находится в [`VANILLA_PRODUCT_PLAN.md`](VANILLA_PRODUCT_PLAN.md), а поддерживаемый API — в
[`packages/atl-ui-vanilla/docs/public-api.md`](packages/atl-ui-vanilla/docs/public-api.md).

## Vanilla Web Components

```bash
npm install @atlanticrev/atl-ui-vanilla
```

Для production-приложения подключайте только нужные entry points:

```ts
import '@atlanticrev/atl-ui-vanilla/default.css';
import { defineAltInput } from '@atlanticrev/atl-ui-vanilla/input';
import { defineAltSelect } from '@atlanticrev/atl-ui-vanilla/select';
import { defineAltTextarea } from '@atlanticrev/atl-ui-vanilla/textarea';

defineAltInput();
defineAltSelect();
defineAltTextarea();
```

```html
<alt-input label="Title" name="title" required></alt-input>
<alt-textarea label="Caption" name="caption" rows="5"></alt-textarea>
<alt-select label="Channel" name="channel" required>
  <alt-option label="YouTube" value="youtube"></alt-option>
  <alt-option label="TikTok" value="tiktok"></alt-option>
</alt-select>
```

Пакет предоставляет 22 категории managed/behavioral компонентов, 12 native CSS recipes, все варианты
календаря и range picker, Drawer/Sheet, а также общий top-layer overlay-механизм. Imports безопасны при SSR
и не регистрируют custom elements автоматически. Полная инструкция находится в
[`packages/atl-ui-vanilla/README.md`](packages/atl-ui-vanilla/README.md); изменения релиза `0.6.0` — в
[`release notes`](packages/atl-ui-vanilla/docs/releases/0.6.0.md).

## React CSS entrypoints

The package ships with three CSS files:

- `@atlanticrev/atl-ui/core.css` - required structural styles for all components
- `@atlanticrev/atl-ui/theme.css` - default `--atl-*` design tokens
- `@atlanticrev/atl-ui/default.css` - convenience bundle that includes both `core.css` and `theme.css`

Public package surface:

```text
@atlanticrev/atl-ui
@atlanticrev/atl-ui/forms
@atlanticrev/atl-ui/core.css
@atlanticrev/atl-ui/theme.css
@atlanticrev/atl-ui/default.css
```

## Install React package

```bash
npm install @atlanticrev/atl-ui
```

Supported host versions: React 18 and React 19.

If you install from GitHub Packages, make sure your npm auth is configured for the `@atlanticrev` scope.

## Usage

For the default experience, import the bundled stylesheet once in your app entry point:

```ts
import '@atlanticrev/atl-ui/default.css';
```

Then use components:

```tsx
import {
	AtlButton,
	AtlInput,
} from '@atlanticrev/atl-ui';

export const Example = () => {
	return (
		<div>
			<AtlButton variant="filled">Save</AtlButton>
			<AtlInput label="Project name" testId="project-name" value="Operations Console" onChange={() => {}} />
		</div>
	);
};
```

## Custom theme setup

If you want to fully control the visual language, import the structural layer and provide your own theme file:

```ts
import '@atlanticrev/atl-ui/core.css';
import './brand-theme.css';
```

You can also start from the built-in tokens and override only part of them:

```ts
import '@atlanticrev/atl-ui/core.css';
import '@atlanticrev/atl-ui/theme.css';
import './brand-overrides.css';
```

Example `brand-theme.css`:

```css
:root {
  --atl-font-sans: 'Suisse Intl', 'Helvetica Neue', Arial, sans-serif;

  --atl-color-bg: #f4f3ef;
  --atl-color-surface: #ffffff;
  --atl-color-surface-soft: #f7f6f2;
  --atl-color-surface-muted: #eceae4;
  --atl-color-surface-strong: #e0ddd6;
  --atl-color-ink: #111111;
  --atl-color-ink-muted: #5f5b54;
  --atl-color-border: #d5d0c8;
  --atl-color-border-strong: #8d877f;
  --atl-color-accent: #111111;
  --atl-color-accent-muted: #e9e5dd;
  --atl-color-accent-ink: #ffffff;

  --atl-radius-xs: 4px;
  --atl-radius-sm: 8px;
  --atl-radius-md: 12px;
  --atl-radius-lg: 16px;
  --atl-radius-full: 9999px;

  --atl-shadow-sm: none;
  --atl-shadow-md: 0 12px 32px rgb(17 17 17 / 0.08);
  --atl-shadow-lg: 0 24px 56px rgb(17 17 17 / 0.14);
}

[data-theme='dark'] {
  --atl-color-bg: #0e0e0e;
  --atl-color-surface: #171717;
  --atl-color-surface-soft: #1d1d1d;
  --atl-color-surface-muted: #242424;
  --atl-color-surface-strong: #2e2e2e;
  --atl-color-ink: #f3f3f3;
  --atl-color-ink-muted: #b7b7b7;
  --atl-color-border: #3a3a3a;
  --atl-color-border-strong: #5d5d5d;
  --atl-color-accent: #f3f3f3;
  --atl-color-accent-muted: #2a2a2a;
  --atl-color-accent-ink: #111111;
}
```

## Public theming contract

Consumers should not copy or replace the library SCSS source files.

The intended customization order is:

1. Override semantic tokens such as `--atl-color-*`, `--atl-type-*`, `--atl-radius-*`, and `--atl-shadow-*`
2. Use documented component-scoped variables like `--atl-modal-width`, `--atl-avatar-*`, and `--atl-input-*`
3. Override stable library selectors such as `.atl-button`, `.atl-button--filled`,
   `.atl-input__root`, or `.atl-tabs__tab` only when token overrides are not enough

`core.css` is the stable structural layer.
`theme.css` is only a default theme implementation.

## Forms

The package also ships a headless forms module:

```ts
import {
	AtlFormProvider,
	useAtlField,
	useAtlForm,
	useAtlFormState,
} from '@atlanticrev/atl-ui/forms';
```

Minimal example:

```tsx
import { AtlButton, AtlInput } from '@atlanticrev/atl-ui';
import {
	AtlFormProvider,
	useAtlField,
	useAtlForm,
	useAtlFormState,
} from '@atlanticrev/atl-ui/forms';

type LoginForm = {
	email: string;
};

const EmailField = () => {
	const email = useAtlField<LoginForm>('email');

	return (
		<AtlInput
			helperText={email.message}
			label="Email"
			status={email.invalid ? 'error' : 'default'}
			value={String(email.value ?? '')}
			onBlur={email.onBlur}
			onChange={(value) => email.setValue(value)}
		/>
	);
};

export const LoginFormView = () => {
	const form = useAtlForm<LoginForm>({
		defaultValues: {
			email: '',
		},
	});
	const isSubmitting = useAtlFormState(form, (state) => state.isSubmitting);

	return (
		<AtlFormProvider form={form}>
			<form onSubmit={form.handleSubmit(async (values) => console.log(values))}>
				<EmailField />
				<AtlButton disabled={isSubmitting} type="submit">
					Submit
				</AtlButton>
			</form>
		</AtlFormProvider>
	);
};
```

Included in `@atlanticrev/atl-ui/forms`:

- `useAtlForm`
- `AtlFormProvider`
- `useAtlField`
- `useAtlWatch`
- `useAtlFormState`
- `AtlController`
- bindings for `AtlInput`, `AtlSelect`, `AtlCheckbox`, `AtlSwitcher`, `AtlAutocomplete`, and `AtlRadioButton`
- runtime/SDUI helpers via `AtlRuntimeForm`, runtime schema types, and `createRuntimeResolver`
- optional `createZodResolver` adapter without coupling the core store to Zod

## Button variants

Supported button variants:

- `filled`
- `tonal`
- `outlined`
- `text`
- `elevated`
- `danger`

## Scripts

Development uses Node `24.18.0`. Run `nvm install` once and `nvm use` when entering the repository before
installing dependencies or running scripts; npm will reject unsupported development runtimes.

- `npm run build`
- `npm run lint`
- `npm run format:fix` — safe Biome fixes/formatting, then `atl-formatter` for the vanilla package
- `npm run typecheck`
- `npm run storybook`
- `npm run build-storybook`
- `npm run release:patch`
- `npm run release:vanilla:check`
- `npm run publish:vanilla` — ручная публикация vanilla-пакета после проверки release gate

The same `format:fix` pipeline runs automatically for staged code and style files before every commit.

## React release

Safe release flow:

```bash
npm run release:patch
```

It runs:

1. `lint`
2. `typecheck`
3. `build`
4. `npm version patch`
5. `npm publish`

Vanilla-пакет выпускается отдельно. Подробная безопасная инструкция находится в
[`packages/atl-ui-vanilla/docs/releasing.md`](packages/atl-ui-vanilla/docs/releasing.md); автоматической
публикации по тегу нет.
