import type { Meta, StoryObj } from '@storybook/react';

import { AtlButton } from './index';

const BUTTON_VARIANTS = ['primary', 'ghost'] as const;

const meta: Meta<typeof AtlButton> = {
	title: 'Components/AtlButton',
	component: AtlButton,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlButton - base action component with primary and ghost variants.

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
		children: 'AtlButton',
		variant: 'primary',
		disabled: false,
		disableMotion: false,
	},
};

export default meta;

type Story = StoryObj<typeof AtlButton>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<AtlButton variant="primary">Primary</AtlButton>
			<AtlButton variant="ghost">Ghost</AtlButton>
			<AtlButton variant="primary" disabled>
				Disabled
			</AtlButton>
			<AtlButton variant="ghost" disableMotion>
				No motion
			</AtlButton>
		</div>
	),
};
