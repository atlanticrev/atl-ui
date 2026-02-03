import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { AtlSelect } from './index';

const options = [
	{ value: 'figma', label: 'Figma' },
	{ value: 'notion', label: 'Notion' },
	{ value: 'linear', label: 'Linear' },
	{ value: 'slack', label: 'Slack' },
];

type SelectArgs = ComponentProps<typeof AtlSelect>;

const SelectDemo = ({ label, helper, options: selectOptions }: SelectArgs) => {
	const [value, setValue] = useState(selectOptions[0]?.value ?? '');

	return (
		<div style={{ display: 'grid', gap: '1rem' }}>
			<AtlSelect
				helper={helper}
				label={label}
				options={selectOptions}
				value={value}
				onChange={setValue}
			/>
		</div>
	);
};

const meta: Meta<typeof AtlSelect> = {
	title: 'Components/AtlSelect',
	component: AtlSelect,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlSelect - single-value dropdown with helper text.

## Features
- Controlled value
- Keyboard navigation
- Optional helper text
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
		},
		helper: {
			control: 'text',
		},
	},
	args: {
		label: 'Workspace',
		helper: 'Pick the primary workspace',
		options,
		value: options[0]?.value ?? '',
		onChange: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof AtlSelect>;

export const Default: Story = {
	render: (args) => <SelectDemo {...args} />,
};
