export type FileUploadStatus = 'default' | 'error' | 'success';

export type AtlFileUploadProps = {
	accept?: string;
	className?: string;
	disabled?: boolean;
	helperText?: string;
	label: string;
	multiple?: boolean;
	onChange?: (files: File[]) => void;
	status?: FileUploadStatus;
	testId?: string;
};
