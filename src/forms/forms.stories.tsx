import type { Meta, StoryObj } from '@storybook/react';

import { LoginFormDemo } from './stories/login-form-demo';

const meta: Meta = {
	title: 'Forms/Login Form',
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
Headless login form demo built with \`useAtlForm\`, \`AtlFormProvider\`, \`useAtlInputBinding\`, and resolver validation.
				`,
			},
		},
	},
	tags: ['autodocs'],
};

export default meta;

export const Default: StoryObj = {
	render: () => <LoginFormDemo />,
};
