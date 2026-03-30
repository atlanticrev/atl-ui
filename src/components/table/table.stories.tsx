import type { Meta, StoryObj } from '@storybook/react';

import { AtlSimpleTable } from './index';

const meta: Meta<typeof AtlSimpleTable> = {
	title: 'Components/AtlSimpleTable',
	component: AtlSimpleTable,
	parameters: { layout: 'padded' },
	tags: ['autodocs'],
	args: {
		ariaLabel: 'Demo table',
		columns: [
			{ key: 'name', dataIndex: 'name', title: 'Name' },
			{ key: 'status', dataIndex: 'status', title: 'Status' },
		],
		dataSource: [
			{ name: 'Atlantic', status: 'Active' },
			{ name: 'Pacific', status: 'Paused' },
		],
	},
};

export default meta;

export const Default: StoryObj<typeof AtlSimpleTable> = {};
