import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { AutocompleteOption } from './types';
import { AtlAutocomplete } from './index';

const options: AutocompleteOption<string>[] = [
	{ value: 'figma', label: 'Figma', description: 'Design workspace' },
	{ value: 'linear', label: 'Linear', description: 'Issue tracking' },
	{ value: 'notion', label: 'Notion', description: 'Docs and notes' },
];

const Demo = () => {
	const [value, setValue] = useState<string | undefined>('figma');

	return <AtlAutocomplete label="Tool" options={options} testId="autocomplete" value={value} onChange={setValue} />;
};

const meta: Meta<typeof AtlAutocomplete> = {
	title: 'Components/AtlAutocomplete',
	component: AtlAutocomplete,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlAutocomplete> = {
	render: () => <Demo />,
};
