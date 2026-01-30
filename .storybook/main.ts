import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	stories: ['../src/**/*.stories.@(ts|tsx)'],
	addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
	docs: {
		autodocs: 'tag',
	},
	viteFinal: async (config) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = {
			...(config.resolve.alias as Record<string, string>),
			'@': path.resolve(__dirname, '../src'),
		};
		return config;
	},
};

export default config;
