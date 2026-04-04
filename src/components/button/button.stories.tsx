import type { Meta, StoryObj } from '@storybook/react';

import { AtlButton } from './index';

const BUTTON_VARIANTS = ['filled', 'tonal', 'outlined', 'text', 'elevated'] as const;

const meta: Meta<typeof AtlButton> = {
	title: 'Components/AtlButton',
	component: AtlButton,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlButton - monochrome action component.

## Features
- variants: filled, tonal, outlined, text, elevated
- loading state
- icon support
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
	},
	args: {
		children: 'AtlButton',
		variant: 'filled',
	},
};

export default meta;

type Story = StoryObj<typeof AtlButton>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<AtlButton variant="filled">Filled</AtlButton>

			<AtlButton variant="tonal">Tonal</AtlButton>

			<AtlButton variant="outlined">Outlined</AtlButton>

			<AtlButton variant="text">Text</AtlButton>

			<AtlButton variant="elevated">Elevated</AtlButton>

			<AtlButton disabled variant="filled">Disabled</AtlButton>
		</div>
	),
};
