import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { SelectOption } from './types';
import { AtlSelect } from './index';

const options: SelectOption<string>[] = [
	{ value: 'figma', label: 'Figma' },
	{ value: 'notion', label: 'Notion' },
	{ value: 'linear', label: 'Linear' },
	{ value: 'slack', label: 'Slack' },
];

const SelectDemo = ({ helperText, label, searchable = false }: { helperText?: string; label: string; searchable?: boolean }) => {
	const [value, setValue] = useState(options[0]?.value ?? '');

	return (
		<div style={{ display: 'grid', gap: '1rem', width: 320 }}>
			<AtlSelect
				testId="select"
				helperText={helperText}
				label={label}
				options={options}
				searchable={searchable}
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
	},
	tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof AtlSelect>;

export const Default: Story = {
	render: () => <SelectDemo helperText="Pick the primary workspace" label="Workspace" />,
};

export const Searchable: Story = {
	render: () => <SelectDemo label="Workspace" searchable />,
};
