import type { Meta, StoryObj } from '@storybook/react';

import { Card } from './index';

const meta: Meta<typeof Card> = {
	title: 'Components/Card',
	component: Card,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Card - surface container for grouping content.

## Features
- Polymorphic via the \`as\` prop
- Minimal layout styling
				`,
			},
		},
	},
	tags: ['autodocs'],
	args: {
		children: (
			<>
				<strong>Neutral card</strong>
				<p style={{ margin: '0.5rem 0 0', color: 'var(--ui-muted)' }}>
					Minimal surface for grouping content.
				</p>
			</>
		),
	},
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const AsLink: Story = {
	render: () => (
		<Card as="a" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
			<strong>Card as link</strong>
			<p style={{ margin: '0.5rem 0 0', color: 'var(--ui-muted)' }}>
				Supports polymorphic usage via the `as` prop.
			</p>
		</Card>
	),
};

export const Overview: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', maxWidth: 520 }}>
			<Card>
				<strong>Neutral card</strong>
				<p style={{ margin: '0.5rem 0 0', color: 'var(--ui-muted)' }}>
					Minimal surface for grouping content.
				</p>
			</Card>
			<Card as="a" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
				<strong>Card as link</strong>
				<p style={{ margin: '0.5rem 0 0', color: 'var(--ui-muted)' }}>
					Supports polymorphic usage via the `as` prop.
				</p>
			</Card>
		</div>
	),
};
