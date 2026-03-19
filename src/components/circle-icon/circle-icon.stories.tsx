import type { Meta, StoryObj } from '@storybook/react';

import { SuitcaseIcon } from '@/icons/suitcase-icon';

import { AtlCircleIcon } from './index';

const meta: Meta<typeof AtlCircleIcon> = {
	title: 'Components/AtlCircleIcon',
	component: AtlCircleIcon,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Initials: StoryObj<typeof AtlCircleIcon> = {
	args: {
		contentType: 'initials',
		initials: 'JD',
		size: 48,
	},
};

export const Icon: StoryObj<typeof AtlCircleIcon> = {
	args: {
		contentType: 'icon',
		icon: SuitcaseIcon,
		size: 48,
	},
};
