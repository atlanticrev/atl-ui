import type { Meta, StoryObj } from '@storybook/react';

import { AtlDropdown } from './index';

const items = [
	{ value: 'first', label: 'First action' },
	{ value: 'second', label: 'Second action', description: 'With description' },
	{ value: 'third', label: 'Third action' },
];

const meta: Meta<typeof AtlDropdown> = {
	title: 'Components/AtlDropdown',
	component: AtlDropdown,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	args: {
		items,
		selectedValues: ['second'],
		testId: 'dropdown',
	},
};

export default meta;

type Story = StoryObj<typeof AtlDropdown>;

export const Default: Story = {};

export const Empty: Story = {
	args: {
		emptyState: 'No results found',
		items: [],
	},
};

export const WithFooter: Story = {
	args: {
		footerText: '3 items available',
		multiSelect: true,
		selectAllText: 'Select all',
		showFooter: true,
	},
};
