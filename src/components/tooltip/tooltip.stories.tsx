import type { Meta, StoryObj } from '@storybook/react';

import { AtlTooltip } from './index';

const meta: Meta<typeof AtlTooltip> = {
	title: 'Components/AtlTooltip',
	component: AtlTooltip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		testId: 'tooltip',
		title: 'Helpful information',
		children: <span>Hover me</span>,
	},
};

export default meta;

export const Default: StoryObj<typeof AtlTooltip> = {};
