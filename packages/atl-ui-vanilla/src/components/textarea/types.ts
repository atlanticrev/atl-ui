export type AltTextareaSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export type AltTextareaStatus = 'default' | 'error' | 'success';

export type AltTextareaChangeDetail = {
	value: string;
};

export type AltTextareaElementApi = HTMLElement & {
	checkValidity: () => boolean;
	disabled: boolean;
	form: HTMLFormElement | null;
	readOnly: boolean;
	readOnlyStyled: boolean;
	reportValidity: () => boolean;
	select: () => void;
	setCustomValidity: (message: string) => void;
	textareaElement: HTMLTextAreaElement | null;
	validationMessage: string;
	validity: ValidityState | null;
	value: string;
};
