import type { Meta, StoryObj } from '@storybook/react';
import { useRef, useState } from 'react';

import { Button } from '@/components/button';
import { Dropdown } from './index';

const DROPDOWN_MODES = ['anchored', 'modal', 'auto'] as const;
const DROPDOWN_PLACEMENTS = ['bottom-start', 'bottom-end', 'top-start', 'top-end'] as const;

type DemoProps = {
	mode?: (typeof DROPDOWN_MODES)[number];
	placement?: (typeof DROPDOWN_PLACEMENTS)[number];
	offset?: number;
};

const DropdownDemo = ({ mode = 'anchored', placement = 'bottom-start', offset = 8 }: DemoProps) => {
	const [open, setOpen] = useState(false);
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const isModal = mode === 'modal';

	return (
		<div style={{ minHeight: 220, display: 'grid', gap: '1rem', alignContent: 'start' }}>
			<Button
				ref={anchorRef}
				onClick={() => setOpen((prev) => !prev)}
				variant="primary"
				style={{ width: 140 }}
			>
				Toggle dropdown
			</Button>

			<Dropdown
				anchorRef={anchorRef}
				isOpen={open}
				onClose={() => setOpen(false)}
				mode={mode}
				placement={placement}
				offset={offset}
			>
				<div className={isModal ? undefined : 'ui-dropdown__panel'}>
					<div style={{ display: 'grid', gap: '0.4rem' }}>
						<Button variant="ghost" disableMotion>
							First action
						</Button>
						<Button variant="ghost" disableMotion>
							Second action
						</Button>
						<Button variant="ghost" disableMotion>
							Third action
						</Button>
					</div>
				</div>
			</Dropdown>
		</div>
	);
};

const meta: Meta<typeof Dropdown> = {
	title: 'Components/Dropdown',
	component: Dropdown,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Dropdown - floating panel with anchored, modal, or auto behavior.

## Features
- 3 modes: anchored, modal, auto
- 4 placements with auto flipping
- Optional offset
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		mode: {
			control: 'select',
			options: DROPDOWN_MODES,
		},
		placement: {
			control: 'select',
			options: DROPDOWN_PLACEMENTS,
		},
		offset: {
			control: { type: 'number', min: 0, step: 1 },
		},
	},
	args: {
		mode: 'anchored',
		placement: 'bottom-start',
		offset: 8,
	},
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
	render: (args) => <DropdownDemo {...args} />,
};

export const Anchored: Story = {
	render: (args) => <DropdownDemo {...args} mode="anchored" placement="bottom-start" />,
};

export const Modal: Story = {
	render: (args) => <DropdownDemo {...args} mode="modal" />,
};

export const Auto: Story = {
	render: (args) => <DropdownDemo {...args} mode="auto" placement="bottom-end" />,
};
