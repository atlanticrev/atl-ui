export type AltFileUploadStatus = 'default' | 'error' | 'success';

export type AltFileUploadChangeDetail = {
	files: readonly File[];
};

export type AltFileUploadElementApi = HTMLElement & {
	accept: string;
	buttonIcon: Node | null;
	clear: () => void;
	disabled: boolean;
	files: FileList | null;
	helperText: string;
	inputElement: HTMLInputElement | null;
	label: string;
	multiple: boolean;
	name: string;
	status: AltFileUploadStatus;
};
