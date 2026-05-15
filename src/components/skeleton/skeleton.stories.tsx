import type { Meta, StoryObj } from '@storybook/react';

import { AtlCard } from '../card';

import { AtlSkeleton } from './index';

const meta: Meta<typeof AtlSkeleton> = {
	title: 'Components/AtlSkeleton',
	component: AtlSkeleton,
	parameters: {
		layout: 'padded',
	},
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AtlSkeleton>;

const DemoCard = () => (
	<AtlCard>
		<div style={{ display: 'grid', gap: '0.75rem' }}>
			<strong>Jane Cooper</strong>
			<span>Product designer</span>
		</div>
	</AtlCard>
);

export const Overlay: Story = {
	render: () => (
		<div style={{ maxWidth: 320 }}>
			<AtlSkeleton loading>
				<DemoCard />
			</AtlSkeleton>
		</div>
	),
};

export const Inline: Story = {
	args: {
		height: 24,
		loading: true,
		variant: 'line',
		width: 180,
	},
	render: (args) => (
		<AtlSkeleton {...args}>
			<h2>Revenue</h2>
		</AtlSkeleton>
	),
};

export const ManualShapes: Story = {
	render: () => (
		<div style={{ display: 'grid', gap: '1rem', maxWidth: 320 }}>
			<AtlSkeleton size={48} variant="circle" />
			<AtlSkeleton height={20} variant="line" width="60%" />
			<AtlSkeleton height={88} variant="rect" />
		</div>
	),
};

export const Repeated: Story = {
	render: () => (
		<AtlSkeleton.Repeat count={4}>
			<AtlSkeleton height={76} variant="rect" />
		</AtlSkeleton.Repeat>
	),
};
