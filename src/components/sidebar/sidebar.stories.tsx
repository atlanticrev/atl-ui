import type { Meta, StoryObj } from '@storybook/react';

import { SuitcaseIcon } from '@/icons/suitcase-icon';

import { AtlSidebar } from './index';

const meta: Meta<typeof AtlSidebar> = {
	title: 'Components/AtlSidebar',
	component: AtlSidebar,
	parameters: { layout: 'fullscreen' },
	tags: ['autodocs'],
	args: {
		items: [
			{ key: 'dashboard', label: 'Dashboard', icon: <SuitcaseIcon /> },
			{ key: 'reports', label: 'Reports', icon: <SuitcaseIcon /> },
		],
		selectedKey: 'dashboard',
		testId: 'sidebar',
	},
};

export default meta;

export const Default: StoryObj<typeof AtlSidebar> = {};
