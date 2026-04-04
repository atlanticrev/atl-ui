import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { AtlInput } from './input';

const IconBase = ({ children }: { children: ReactNode }) => (
	<svg
		aria-hidden="true"
		fill="none"
		height="24"
		stroke="currentColor"
		strokeLinecap="round"
		strokeLinejoin="round"
		strokeWidth="2"
		viewBox="0 0 24 24"
		width="24"
	>
		{children}
	</svg>
);

const ChevronDownIcon = () => (
	<IconBase>
		<polyline points="6 9 12 15 18 9" />
	</IconBase>
);

const CheckIcon = () => (
	<IconBase>
		<polyline points="4 12 9 17 20 6" />
	</IconBase>
);

const CrossIcon = () => (
	<IconBase>
		<line x1="6" x2="18" y1="6" y2="18" />

		<line x1="18" x2="6" y1="6" y2="18" />
	</IconBase>
);

const SpinnerIcon = () => (
	<IconBase>
		<circle cx="12" cy="12" r="9" opacity="0.3" />

		<path d="M21 12a9 9 0 0 0-9-9" />
	</IconBase>
);

const UI_INPUT_SIZES = ['xl', 'l', 'm', 's', 'xs'] as const;
const UI_INPUT_STATUSES = ['default', 'error', 'success'] as const;
const UI_INPUT_VARIANTS = ['text', 'number'] as const;

const iconOptions = {
	none: undefined,
	chevronDown: <ChevronDownIcon />,
	check: <CheckIcon />,
	cross: <CrossIcon />,
	spinner: <SpinnerIcon />,
};

const meta: Meta<typeof AtlInput> = {
	title: 'Components/AtlInput',
	component: AtlInput,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
AtlInput - universal input component with support for various sizes, states, and display variants.

## Features
- 5 sizes: xl, l, m, s, xs
- 3 statuses: default, error, success
- 2 variants: text, number (for displaying numeric values)
- Floating label
- Helper text with status support
- Character counter
- Left and right icon support

## Usage
\`\`\`tsx
import { AtlInput } from './input';

<AtlInput
  testId="my-input"
  label="Email"
  value={email}
  onChange={setEmail}
/>
\`\`\`
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: 'select',
			options: UI_INPUT_SIZES,
		},
		status: {
			control: 'select',
			options: UI_INPUT_STATUSES,
		},
		variant: {
			control: 'select',
			options: UI_INPUT_VARIANTS,
		},
		disabled: {
			control: 'boolean',
		},
		readOnly: {
			control: 'boolean',
		},
		showCharacterCount: {
			control: 'boolean',
		},
		iconLeft: {
			control: 'select',
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		iconRight: {
			control: 'select',
			options: Object.keys(iconOptions),
			mapping: iconOptions,
		},
		iconRightRotated: {
			control: 'boolean',
		},
	},
	args: {
		testId: 'atl-input',
		size: 'm',
		status: 'default',
		variant: 'text',
		disabled: false,
		readOnly: false,
		showCharacterCount: true,
		iconRight: <ChevronDownIcon />,
		label: 'Label',
		helperText: 'Helper text',
	},
};

export default meta;

type Story = StoryObj<typeof AtlInput>;

export const Default: Story = {
	args: {
		label: 'Label',
		helperText: 'Helper text',
	},
};

export const WithValue: Story = {
	args: {
		label: 'Label',
		value: 'Value',
		helperText: 'Helper text',
	},
};

export const WithPlaceholder: Story = {
	args: {
		placeholder: 'Enter value...',
		helperText: 'Helper text',
	},
};

export const ErrorState: Story = {
	args: {
		label: 'Label',
		value: 'Invalid value',
		status: 'error',
		helperText: 'This field has an error',
	},
};

export const Success: Story = {
	args: {
		label: 'Label',
		value: 'Valid value',
		status: 'success',
		helperText: 'This field is valid',
		iconRight: <CheckIcon />,
	},
};

export const Disabled: Story = {
	args: {
		label: 'Label',
		value: 'Disabled value',
		disabled: true,
		helperText: 'This field is disabled',
	},
};

export const ReadOnly: Story = {
	args: {
		label: 'Label',
		value: 'Read only value',
		readOnly: true,
		helperText: 'This field is read only',
	},
};

export const WithCharacterCount: Story = {
	args: {
		label: 'Label',
		value: 'Some text',
		maxLength: 300,
		showCharacterCount: true,
		helperText: 'Helper text',
	},
};

export const WithLeftIcon: Story = {
	args: {
		label: 'Search',
		value: '',
		iconLeft: <SpinnerIcon />,
		helperText: 'Helper text',
	},
};

export const WithDropdownIcon: Story = {
	args: {
		label: 'Label',
		value: 'Selected value',
		iconRight: <ChevronDownIcon />,
		helperText: 'Helper text',
	},
};

export const WithBothIcons: Story = {
	args: {
		label: 'Country',
		value: 'Czech Republic',
		iconLeft: <CheckIcon />,
		iconRight: <ChevronDownIcon />,
		helperText: 'Select country',
	},
};

export const WithRotatedIcon: Story = {
	args: {
		label: 'Country',
		value: 'Czech Republic',
		iconRight: <ChevronDownIcon />,
		iconRightRotated: true,
		helperText: 'Dropdown is open',
	},
};

function SelectSimulationDemo() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AtlInput
			readOnly
			helperText={isOpen ? 'Click to close' : 'Click to open'}
			iconRight={<ChevronDownIcon />}
			iconRightRotated={isOpen}
			label="Country"
			testId="select-simulation"
			value="Czech Republic"
			onIconRightClick={() => setIsOpen(!isOpen)}
		/>
	);
}

export const SelectSimulation: Story = {
	render: () => <SelectSimulationDemo />,
};

export const NumberVariant: Story = {
	args: {
		label: 'Amount',
		value: '500.00',
		variant: 'number',
		size: 'xl',
		helperText: 'Enter amount',
	},
};

export const SizeXl: Story = {
	args: {
		label: 'Label',
		value: '500.00',
		variant: 'number',
		size: 'xl',
		helperText: 'Size XL',
	},
};

export const SizeL: Story = {
	args: {
		label: 'Label',
		value: '500.00',
		variant: 'number',
		size: 'l',
		helperText: 'Size L',
	},
};

export const SizeM: Story = {
	args: {
		label: 'Label',
		value: 'Value',
		size: 'm',
		helperText: 'Size M',
	},
};

export const SizeS: Story = {
	args: {
		label: 'Label',
		value: 'Value',
		size: 's',
		helperText: 'Size S',
	},
};

export const SizeXs: Story = {
	args: {
		label: 'Label',
		value: 'Value',
		size: 'xs',
		helperText: 'Size XS',
	},
};

function InteractiveInputDemo() {
	const [value, setValue] = useState('');

	return (
		<AtlInput
			showCharacterCount
			helperText={`Characters: ${value.length}`}
			label="Type something"
			maxLength={50}
			testId="interactive-input"
			value={value}
			onChange={setValue}
		/>
	);
}

export const Interactive: Story = {
	render: () => <InteractiveInputDemo />,
};

export const AllSizes: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
			}}
		>
			<AtlInput
				helperText="Size XL - for number inputs"
				label="Amount"
				size="xl"
				testId="size-xl"
				value="500.00"
				variant="number"
			/>

			<AtlInput
				helperText="Size L - for number inputs"
				label="Amount"
				size="l"
				testId="size-l"
				value="500.00"
				variant="number"
			/>

			<AtlInput helperText="Size M - default" label="Label" size="m" testId="size-m" value="Value" />

			<AtlInput helperText="Size S" label="Label" size="s" testId="size-s" value="Value" />

			<AtlInput helperText="Size XS - compact" label="Label" size="xs" testId="size-xs" value="Value" />
		</div>
	),
};

export const AllStatuses: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
			}}
		>
			<AtlInput helperText="Default state" label="Default" status="default" testId="status-default" value="Value" />

			<AtlInput helperText="This field has an error" label="Error" status="error" testId="status-error" value="Invalid" />

			<AtlInput
				helperText="This field is valid"
				iconRight={<CheckIcon />}
				label="Success"
				status="success"
				testId="status-success"
				value="Valid"
			/>
		</div>
	),
};

export const AllStates: Story = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '24px',
			}}
		>
			<AtlInput helperText="Empty state with label as placeholder" label="Empty" testId="state-empty" />

			<AtlInput helperText="Filled state with floating label" label="Filled" testId="state-filled" value="Some value" />

			<AtlInput disabled helperText="Disabled state" label="Disabled" testId="state-disabled" value="Disabled value" />

			<AtlInput readOnly helperText="Read only state" label="Read Only" testId="state-readonly" value="Read only value" />
		</div>
	),
};
