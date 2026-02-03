import type { Meta, StoryObj } from '@storybook/react';

import { AtlProgress } from './index';

const meta: Meta<typeof AtlProgress> = {
	title: 'Components/AtlProgress',
	component: AtlProgress,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlProgress - labeled progress indicator.

## Features
- Clamps value between 0 and 100
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
		},
		value: {
			control: { type: 'number', min: 0, max: 100, step: 1 },
		},
	},
	args: {
		label: 'Processing',
		value: 42,
	},
};

export default meta;

type Story = StoryObj<typeof AtlProgress>;

export const Default: Story = {};

export const Overview: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', maxWidth: 320 }}>
			<AtlProgress label="Queued" value={0} />
			<AtlProgress label="Processing" value={42} />
			<AtlProgress label="Complete" value={100} />
		</div>
	),
};
