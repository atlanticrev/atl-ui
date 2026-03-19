import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlButton } from '@/components/button';

import { AtlModal } from './index';

const Demo = () => {
	const [open, setOpen] = useState(false);

	return (
		<>
			<AtlButton onClick={() => setOpen(true)}>Open modal</AtlButton>
			<AtlModal isOpen={open} testId="modal" title="Confirm action" onClose={() => setOpen(false)}>
				<div style={{ minWidth: 320 }}>Modal content</div>
			</AtlModal>
		</>
	);
};

const meta: Meta<typeof AtlModal> = {
	title: 'Components/AtlModal',
	component: AtlModal,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlModal> = {
	render: () => <Demo />,
};
