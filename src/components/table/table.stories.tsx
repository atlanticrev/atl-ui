import type { Meta, StoryObj } from '@storybook/react';

import { AtlTable } from './index';

const meta: Meta<typeof AtlTable> = {
	title: 'Components/AtlTable',
	component: AtlTable,
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

export const Default: StoryObj<typeof AtlTable> = {};
