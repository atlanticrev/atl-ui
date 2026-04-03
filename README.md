# @atlanticrev/atl-ui

Monochrome React UI library for Atlantic Rev.

## CSS entrypoints

The package ships with three CSS files:

- `@atlanticrev/atl-ui/core.css` - required structural styles for all components
- `@atlanticrev/atl-ui/theme.css` - default `--atl-*` design tokens
- `@atlanticrev/atl-ui/default.css` - convenience bundle that includes both `core.css` and `theme.css`

Public package surface:

```text
@atlanticrev/atl-ui
@atlanticrev/atl-ui/core.css
@atlanticrev/atl-ui/theme.css
@atlanticrev/atl-ui/default.css
```

## Install

```bash
npm install @atlanticrev/atl-ui
```

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

## Button variants

Supported button variants:

- `filled`
- `tonal`
- `outlined`
- `text`
- `elevated`
- `danger`

## Scripts

- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run storybook`
- `npm run build-storybook`
- `npm run release:patch`

## Release

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
