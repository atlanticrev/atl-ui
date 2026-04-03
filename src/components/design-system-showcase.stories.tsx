import type { Meta, StoryObj } from '@storybook/react';

import { DesignSystemShowcase } from './design-system-showcase/showcase';

const meta: Meta = {
	title: 'Design System/Showcase',
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
};

export default meta;

export const Overview: StoryObj = {
	render: () => <DesignSystemShowcase />,
};
