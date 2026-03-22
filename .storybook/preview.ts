import type { Preview } from '@storybook/react';
import { createElement } from 'react';

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
			const isFullscreen = context.parameters.layout === 'fullscreen';

			return createElement(
				'div',
				{
					['data-theme']: themeMode,
					style: {
						minHeight: isFullscreen ? '100vh' : undefined,
						padding: isFullscreen ? 0 : '24px',
						background: 'var(--md-sys-color-background)',
						color: 'var(--md-sys-color-on-background)',
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
			default: 'material',
			values: [
				{ name: 'material', value: '#fef7ff' },
				{ name: 'material-dark', value: '#141218' },
			],
		},
	},
};

export default preview;
