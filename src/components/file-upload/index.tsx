import type { ChangeEvent } from 'react';
import { useId } from 'react';

import { clsx } from '@/lib/clsx';

type FileUploadProps = {
	label: string;
	onFileSelected: (file: File | null) => void;
	accept?: string;
	hint?: string;
	className?: string;
};

export function FileUpload({ label, onFileSelected, accept, hint, className }: FileUploadProps) {
	const inputId = useId();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onFileSelected(event.target.files?.[0] ?? null);
	};

	const classes = clsx('ui-file-upload', className);

	return (
		<div className={classes}>
			<label
				className="ui-file-upload__button"
				htmlFor={inputId}
			>
				{label}
			</label>

			<input
				className="ui-file-upload__input"
				id={inputId}
				type="file"
				accept={accept}
				onChange={handleChange}
			/>

			{hint ? <span className="ui-file-upload__hint">{hint}</span> : null}
		</div>
	);
}
