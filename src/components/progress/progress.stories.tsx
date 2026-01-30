import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from './index';

const meta: Meta<typeof Progress> = {
	title: 'Components/Progress',
	component: Progress,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Progress - labeled progress indicator.

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

type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const Overview: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', maxWidth: 320 }}>
			<Progress label="Queued" value={0} />
			<Progress label="Processing" value={42} />
			<Progress label="Complete" value={100} />
		</div>
	),
};
