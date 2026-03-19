import type { Meta, StoryObj } from '@storybook/react';

import { AtlBreadcrumbs } from './index';

const meta: Meta<typeof AtlBreadcrumbs> = {
	title: 'Components/AtlBreadcrumbs',
	component: AtlBreadcrumbs,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		items: [
			{ testId: 'home', label: 'Home' },
			{ testId: 'library', label: 'Library' },
			{ testId: 'component', label: 'Breadcrumbs' },
		],
	},
};

export default meta;

export const Default: StoryObj<typeof AtlBreadcrumbs> = {};
