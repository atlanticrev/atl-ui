import type { Meta, StoryObj } from '@storybook/react';

import { AtlChip } from './index';

const meta: Meta<typeof AtlChip> = {
	title: 'Components/AtlChip',
	component: AtlChip,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		label: 'Active',
		testId: 'chip',
		withCross: true,
	},
};

export default meta;

export const Default: StoryObj<typeof AtlChip> = {};

export const Danger: StoryObj<typeof AtlChip> = {
	args: {
		label: 'Blocked',
		variant: 'danger',
	},
};
