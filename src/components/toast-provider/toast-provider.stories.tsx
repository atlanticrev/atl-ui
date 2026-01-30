import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/button';
import { ToastProvider, useToast } from './index';

const meta: Meta<typeof ToastProvider> = {
	title: 'Components/ToastProvider',
	component: ToastProvider,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
ToastProvider - context-based toasts with variants.

## Features
- 3 variants: info, success, error
- Auto-dismiss with configurable duration
				`,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ToastProvider>;

const ToastDemo = () => {
	const { enqueueToast } = useToast();

	return (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<Button onClick={() => enqueueToast('Saved changes', { variant: 'success' })}>
				Success toast
			</Button>
			<Button variant="ghost" onClick={() => enqueueToast('Network issue', { variant: 'error' })}>
				Error toast
			</Button>
			<Button variant="ghost" onClick={() => enqueueToast('New version available', { variant: 'info' })}>
				Info toast
			</Button>
		</div>
	);
};

const ProviderStory = () => (
	<ToastProvider>
		<ToastDemo />
	</ToastProvider>
);

export const Default: Story = {
	render: () => <ProviderStory />,
};
