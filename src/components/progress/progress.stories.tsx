import type { Meta, StoryObj } from '@storybook/react';

import { AtlProgress } from './index';

const meta: Meta<typeof AtlProgress> = {
	title: 'Components/AtlProgress',
	component: AtlProgress,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	args: {
		label: 'Upload progress',
		showValue: true,
		value: 48,
	},
	decorators: [
		(Story) => (
			<div style={{ padding: '2rem', width: '100%' }}>
				<Story />
			</div>
		),
	],
};

export default meta;

type Story = StoryObj<typeof AtlProgress>;

export const Default: Story = {};

export const Running: Story = {
	args: {
		label: 'Processing frames',
		status: 'running',
		value: 62,
	},
};

export const Indeterminate: Story = {
	args: {
		indeterminate: true,
		label: 'Preparing export',
		showValue: false,
		status: 'running',
	},
};

export const Failed: Story = {
	args: {
		label: 'Upload progress',
		status: 'failed',
		value: 34,
	},
};

export const Compact: Story = {
	args: {
		label: 'Background task',
		size: 'sm',
		value: 81,
	},
};
