import type { Meta, StoryObj } from '@storybook/react';

import { AtlButton } from '@/components/button';
import { AtlToastProvider, useAtlToast } from './index';

const meta: Meta<typeof AtlToastProvider> = {
	title: 'Components/AtlToastProvider',
	component: AtlToastProvider,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlToastProvider - context-based toasts with variants.

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

type Story = StoryObj<typeof AtlToastProvider>;

const ToastDemo = () => {
	const { enqueueToast } = useAtlToast();

	return (
		<div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
			<AtlButton onClick={() => enqueueToast('Saved changes', { variant: 'success' })}>
				Success toast
			</AtlButton>

			<AtlButton variant="tonal" onClick={() => enqueueToast('Network issue', { variant: 'error' })}>
				Error toast
			</AtlButton>

			<AtlButton variant="tonal" onClick={() => enqueueToast('New version available', { variant: 'info' })}>
				Info toast
			</AtlButton>
		</div>
	);
};

const ProviderStory = () => (
	<AtlToastProvider>
		<ToastDemo />
	</AtlToastProvider>
);

export const Default: Story = {
	render: () => <ProviderStory />,
};
