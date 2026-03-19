import type { Meta, StoryObj } from '@storybook/react';

import { AtlAvatar } from './index';

const meta: Meta<typeof AtlAvatar> = {
	title: 'Components/AtlAvatar',
	component: AtlAvatar,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		fullName: 'Jane Doe',
		type: 'initials',
		variant: 'user',
	},
};

export default meta;

export const Default: StoryObj<typeof AtlAvatar> = {};

export const Company: StoryObj<typeof AtlAvatar> = {
	args: {
		fullName: 'Atlantic Rev',
		type: 'company',
		variant: 'beneficiary',
	},
};
