import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useRef, useState } from 'react';

import { AtlButton } from '@/components/button';

import { AtlPopup } from './index';

const Demo = () => {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setOpen(true);
	}, []);

	return (
		<div ref={anchorRef} style={{ padding: 40 }}>
			<AtlButton onClick={() => setOpen((current) => !current)}>Toggle popup</AtlButton>

			<AtlPopup anchorRef={anchorRef} isOpen={open} testId="popup" onClose={() => setOpen(false)}>
				<div style={{ padding: 12, background: 'white', borderRadius: 8 }}>Popup content</div>
			</AtlPopup>
		</div>
	);
};

const meta: Meta<typeof AtlPopup> = {
	title: 'Components/AtlPopup',
	component: AtlPopup,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlPopup> = {
	render: () => <Demo />,
};
