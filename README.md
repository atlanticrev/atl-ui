# @atlanticrev/atl-ui

Material 3 styled React UI library for Atlantic Rev.

## Install

```bash
npm install @atlanticrev/atl-ui
```

If you install from GitHub Packages, make sure your npm auth is configured for the `@atlanticrev` scope.

## Usage

Import the theme once in your app entry point:

```ts
import '@atlanticrev/atl-ui/theme.css';
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
			<AtlInput label="Project name" testId="project-name" value="Material 3" onChange={() => {}} />
		</div>
	);
};
```

## Button variants

Supported Material 3 button variants:

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
