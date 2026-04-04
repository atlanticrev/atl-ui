import type { Meta, StoryObj } from '@storybook/react';

import { AtlCard } from './index';

const meta: Meta<typeof AtlCard> = {
	title: 'Components/AtlCard',
	component: AtlCard,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlCard - surface container for grouping content.

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

				<p style={{ margin: '0.5rem 0 0', color: 'var(--atl-muted)' }}>
					Minimal surface for grouping content.
				</p>
			</>
		),
	},
};

export default meta;

type Story = StoryObj<typeof AtlCard>;

export const Default: Story = {};

export const AsLink: Story = {
	render: () => (
		<AtlCard as="a" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
			<strong>AtlCard as link</strong>

			<p style={{ margin: '0.5rem 0 0', color: 'var(--atl-muted)' }}>
				Supports polymorphic usage via the `as` prop.
			</p>
		</AtlCard>
	),
};

export const Overview: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', maxWidth: 520 }}>
			<AtlCard>
				<strong>Neutral card</strong>

				<p style={{ margin: '0.5rem 0 0', color: 'var(--atl-muted)' }}>
					Minimal surface for grouping content.
				</p>
			</AtlCard>

			<AtlCard as="a" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
				<strong>AtlCard as link</strong>

				<p style={{ margin: '0.5rem 0 0', color: 'var(--atl-muted)' }}>
					Supports polymorphic usage via the `as` prop.
				</p>
			</AtlCard>
		</div>
	),
};
