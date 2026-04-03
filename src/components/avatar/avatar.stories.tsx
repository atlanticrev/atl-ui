import type { Meta, StoryObj } from '@storybook/react';

import { SuitcaseIcon } from '@/icons/suitcase-icon';

import { AtlAvatar } from './index';

const meta: Meta<typeof AtlAvatar> = {
	title: 'Components/AtlAvatar',
	component: AtlAvatar,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		initials: 'JD',
		size: 48,
	},
};

export default meta;

export const Initials: StoryObj<typeof AtlAvatar> = {};

export const Icon: StoryObj<typeof AtlAvatar> = {
	args: {
		backgroundColor: 'var(--atl-accent-weak)',
		icon: SuitcaseIcon,
	},
};
