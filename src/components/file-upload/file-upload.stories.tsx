import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';

import { FileUpload } from './index';

type FileUploadArgs = ComponentProps<typeof FileUpload>;

const FileUploadDemo = (args: FileUploadArgs) => {
	const [fileName, setFileName] = useState<string>('');

	return (
		<div style={{ display: 'grid', gap: '0.5rem' }}>
			<FileUpload
				{...args}
				onFileSelected={(file) => {
					setFileName(file?.name ?? '');
					args.onFileSelected?.(file ?? null);
				}}
			/>
			{fileName ? <span style={{ fontSize: '0.85rem' }}>Selected: {fileName}</span> : null}
		</div>
	);
};

const meta: Meta<typeof FileUpload> = {
	title: 'Components/FileUpload',
	component: FileUpload,
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: `
FileUpload - minimal file picker with label and hint.

## Features
- Accept filter support
- Optional hint text
				`,
			},
		},
	},
	tags: ['autodocs'],
	argTypes: {
		label: {
			control: 'text',
		},
		hint: {
			control: 'text',
		},
		accept: {
			control: 'text',
		},
	},
	args: {
		label: 'Choose file',
		hint: 'PDF or PNG, up to 4MB',
		accept: '.pdf,.png',
		onFileSelected: () => {},
	},
};

export default meta;

type Story = StoryObj<typeof FileUpload>;

export const Default: Story = {
	render: (args) => <FileUploadDemo {...args} />,
};
