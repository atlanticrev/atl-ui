let nextFileUploadId = 0;

export type FileUploadDom = {
	button: HTMLLabelElement;
	buttonIcon: HTMLSpanElement;
	buttonLabel: HTMLSpanElement;
	helper: HTMLSpanElement;
	input: HTMLInputElement;
	value: HTMLSpanElement;
};

export const createFileUploadDom = (host: HTMLElement): FileUploadDom => {
	const button = host.ownerDocument.createElement('label');
	const buttonIcon = host.ownerDocument.createElement('span');
	const buttonLabel = host.ownerDocument.createElement('span');
	const input = host.ownerDocument.createElement('input');
	const value = host.ownerDocument.createElement('span');
	const helper = host.ownerDocument.createElement('span');
	const inputId = `alt-file-upload-${++nextFileUploadId}`;
	button.className = 'alt-file-upload__button';
	button.htmlFor = inputId;
	buttonIcon.className = 'alt-file-upload__icon';
	buttonIcon.setAttribute('aria-hidden', 'true');
	buttonLabel.className = 'alt-file-upload__label';
	input.className = 'alt-file-upload__input';
	input.id = inputId;
	input.type = 'file';
	value.className = 'alt-file-upload__value';
	helper.className = 'alt-file-upload__helper';
	button.append(buttonIcon, buttonLabel);
	host.replaceChildren(button, input, value, helper);
	return {
		button,
		buttonIcon,
		buttonLabel,
		helper,
		input,
		value,
	};
};

export const formatSelectedFiles = (files: FileList | null): string => {
	if (!files || files.length === 0) return '';
	return files.length === 1 ? files[0].name : `${files.length} files selected`;
};
