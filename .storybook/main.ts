const config = {
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
			'@': new URL('../src', import.meta.url).pathname,
		};
		return config;
	},
} satisfies import('@storybook/react-vite').StorybookConfig;

export default config;
