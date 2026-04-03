import type { Preview } from '@storybook/react';
import { createElement } from 'react';

import './preview.scss';
import '../src/components/core.scss';
import '../src/components/theme.scss';

const preview: Preview = {
	globalTypes: {
		themeMode: {
			defaultValue: 'light',
			name: 'Theme',
			toolbar: {
				icon: 'circlehollow',
				items: [
					{ value: 'light', title: 'Light' },
					{ value: 'dark', title: 'Dark' },
				],
			},
		},
	},
	decorators: [
		(Story, context) => {
			const themeMode = context.globals.themeMode === 'dark' ? 'dark' : 'light';
			const layout = context.parameters.layout ?? 'padded';
			const isDocs = context.viewMode === 'docs';
			const isFullscreen = layout === 'fullscreen';
			const isCentered = layout === 'centered';

			return createElement(
				'div',
				{
					['data-theme']: themeMode,
					style: {
						display: isCentered ? 'flex' : 'block',
						alignItems: isCentered ? 'center' : undefined,
						justifyContent: isCentered ? 'center' : undefined,
						flex: '1 1 auto',
						boxSizing: 'border-box',
						width: '100%',
						maxWidth: '100%',
						minHeight: isDocs ? undefined : '100vh',
						padding: isDocs ? 0 : isFullscreen ? 0 : '24px',
						background: 'var(--atl-color-bg)',
						color: 'var(--atl-color-ink)',
					},
				},
				createElement(Story),
			);
		},
	],
	parameters: {
		actions: { argTypesRegex: '^on[A-Z].*' },
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
		backgrounds: {
			default: 'canvas',
			values: [
				{ name: 'canvas', value: '#f7f7f6' },
				{ name: 'canvas-dark', value: '#13161b' },
			],
		},
	},
};

export default preview;
