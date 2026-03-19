import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AtlTabs } from './index';

const items = [
	{ key: 'overview', label: 'Overview', children: <div>Overview content</div> },
	{ key: 'settings', label: 'Settings', children: <div>Settings content</div> },
];

const Demo = () => {
	const [activeKey, setActiveKey] = useState('overview');
	return <AtlTabs activeKey={activeKey} items={items} testId="tabs" onChange={setActiveKey} />;
};

const meta: Meta<typeof AtlTabs> = {
	title: 'Components/AtlTabs',
	component: AtlTabs,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj<typeof AtlTabs> = {
	render: () => <Demo />,
};
