import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlRadioButton } from './index';

const Demo = () => {
	const [checked, setChecked] = useState(true);
	return <AtlRadioButton checked={checked} label="Primary option" testId="radio" onChange={() => setChecked(true)} />;
};

const meta: Meta<typeof AtlRadioButton> = {
	title: 'Components/AtlRadioButton',
	component: AtlRadioButton,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlRadioButton> = {
	render: () => <Demo />,
};
