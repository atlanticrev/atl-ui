import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { AtlFileUpload } from './index';

type FileUploadArgs = ComponentProps<typeof AtlFileUpload>;

const FileUploadDemo = (args: FileUploadArgs) => {
	const [message, setMessage] = useState('');

	const handleChange = (files: File[]) => {
		setMessage(files.length > 0 ? `Received ${files.length} file(s)` : 'No files selected');
		args.onChange?.(files);
	};

	return (
		<div style={{ display: 'grid', gap: '0.5rem' }}>
			<AtlFileUpload {...args} onChange={handleChange} />

			{message && <span style={{ fontSize: '0.85rem' }}>{message}</span>}
		</div>
	);
};

const meta: Meta<typeof AtlFileUpload> = {
	title: 'Components/AtlFileUpload',
	component: AtlFileUpload,
	parameters: { layout: 'centered' },
	tags: ['autodocs'],
	args: {
		accept: '.pdf,.png',
		helperText: 'PDF or PNG, up to 4MB',
		label: 'Choose file',
		onChange: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof AtlFileUpload>;

export const Default: Story = {
	render: (args) => <FileUploadDemo {...args} />,
};

export const Multiple: Story = {
	args: {
		multiple: true,
	},
	render: (args) => <FileUploadDemo {...args} />,
};
