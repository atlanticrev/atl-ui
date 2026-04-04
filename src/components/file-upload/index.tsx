import type { ChangeEvent } from 'react';
import { useId, useState } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlFileUploadProps } from './types';

const getSelectedLabel = (files: File[]): string => {
	if (files.length === 0) {
		return '';
	}

	if (files.length === 1) {
		return files[0].name;
	}

	return `${files.length} files selected`;
};

export const AtlFileUpload = ({ accept, className, disabled = false, helperText, label, multiple = false, onChange, status = 'default', testId }: AtlFileUploadProps): JSX.Element => {
	const inputId = useId();
	const [selectedLabel, setSelectedLabel] = useState('');

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextFiles = Array.from(event.target.files ?? []);
		setSelectedLabel(getSelectedLabel(nextFiles));
		onChange?.(nextFiles);
	};

	return (
		<div className={clsx('atl-file-upload', `atl-file-upload--${status}`, disabled && 'atl-file-upload--disabled', className)} data-testid={testId}>
			<label className="atl-file-upload__button" htmlFor={inputId}>
				{label}
			</label>

			<input accept={accept} className="atl-file-upload__input" disabled={disabled} id={inputId} multiple={multiple} type="file" onChange={handleChange} />

			{selectedLabel && <span className="atl-file-upload__value">{selectedLabel}</span>}

			{helperText && <span className="atl-file-upload__helper">{helperText}</span>}
		</div>
	);
};
