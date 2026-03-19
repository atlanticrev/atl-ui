import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlCheckbox } from './index';

const Demo = () => {
	const [checked, setChecked] = useState(true);
	return <AtlCheckbox checked={checked} label="Receive updates" testId="checkbox" onChange={setChecked} />;
};

const meta: Meta<typeof AtlCheckbox> = {
	title: 'Components/AtlCheckbox',
	component: AtlCheckbox,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlCheckbox> = {
	render: () => <Demo />,
};
