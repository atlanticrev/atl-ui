import type { Meta, StoryObj } from '@storybook/react';

import { Button } from './index';

const BUTTON_VARIANTS = ['primary', 'ghost'] as const;

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Button - base action component with primary and ghost variants.

## Features
- 2 variants: primary, ghost
- Disabled state
- Optional motion toggle
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: BUTTON_VARIANTS,
		},
		disabled: {
			control: 'boolean',
		},
		disableMotion: {
			control: 'boolean',
		},
	},
	args: {
		children: 'Button',
		variant: 'primary',
		disabled: false,
		disableMotion: false,
	},
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<Button variant="primary">Primary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="primary" disabled>
				Disabled
			</Button>
			<Button variant="ghost" disableMotion>
				No motion
			</Button>
		</div>
	),
};
