import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlSwitcher } from './index';

const Demo = () => {
	const [checked, setChecked] = useState(true);
	return <AtlSwitcher checked={checked} testId="switcher" onChange={setChecked} />;
};

const meta: Meta<typeof AtlSwitcher> = {
	title: 'Components/AtlSwitcher',
	component: AtlSwitcher,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlSwitcher> = {
	render: () => <Demo />,
};
