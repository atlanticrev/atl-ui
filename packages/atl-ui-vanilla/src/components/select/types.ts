export type AltSelectOption = {
	description?: string;
	disabled?: boolean;
	label: string;
	selected?: boolean;
	value: string;
};

export type AltSelectSize = 'l' | 'm' | 's' | 'xl' | 'xs';

export type AltSelectStatus = 'default' | 'error' | 'success';

export type AltSelectChangeDetail = {
	value: string;
	values: readonly string[];
};

export type AltSelectOpenChangeDetail = {
	open: boolean;
};

export type AltSelectElementApi = HTMLElement & {
	close: () => void;
	description: string;
	disabled: boolean;
	form: HTMLFormElement | null;
	helperText: string;
	label: string;
	multiple: boolean;
	name: string;
	open: boolean;
	options: readonly AltSelectOption[];
	placeholder: string;
	required: boolean;
	size: AltSelectSize;
	status: AltSelectStatus;
	show: () => void;
	checkValidity: () => boolean;
	reportValidity: () => boolean;
	setCustomValidity: (message: string) => void;
	toggle: () => void;
	validationMessage: string;
	validity: ValidityState | undefined;
	value: string;
	values: readonly string[];
	willValidate: boolean;
};

export const ALT_SELECT_CHANGE_EVENT = 'alt-change';
export const ALT_SELECT_OPEN_CHANGE_EVENT = 'alt-open-change';
