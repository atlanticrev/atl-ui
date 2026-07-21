import type { OpenChangeReason } from '../../controllers';
import type { AltReplaceableIcon } from '../../icons';

export type AltSelectOption = {
	checkIcon?: Node | null;
	description?: string;
	disabled?: boolean;
	element?: HTMLElement;
	icon?: Node | null;
	label: string;
	selected?: boolean;
	value: string;
};

export type AltSelectSize = 'l' | 'm' | 's' | 'xl' | 'xs';

export type AltSelectStatus = 'default' | 'error' | 'success';

export type AltSelectChangeDetail = {
	option?: AltSelectOption;
	reason: 'clear' | 'remove' | 'select';
	sourceEvent?: Event;
	value: string;
	values: readonly string[];
};

export type AltSelectOpenChangeDetail = {
	open: boolean;
	reason: OpenChangeReason;
	sourceEvent?: Event;
};

export type AltSelectElementApi = HTMLElement & {
	close: () => void;
	clear: () => void;
	closeOnSelect: boolean;
	description: string;
	disabled: boolean;
	form: HTMLFormElement | null;
	helperText: string;
	indicatorIcon: AltReplaceableIcon;
	label: string;
	leadingIcon: Node | null;
	multiple: boolean;
	name: string;
	open: boolean;
	options: readonly AltSelectOption[];
	placeholder: string;
	readOnly: boolean;
	required: boolean;
	size: AltSelectSize;
	status: AltSelectStatus;
	show: () => void;
	select: (value: string) => boolean;
	checkValidity: () => boolean;
	reportValidity: () => boolean;
	setCustomValidity: (message: string) => void;
	toggle: () => void;
	triggerElement: HTMLElement | null;
	validationMessage: string;
	validity: ValidityState | undefined;
	value: string;
	values: readonly string[];
	willValidate: boolean;
};

export const ALT_SELECT_CHANGE_EVENT = 'alt-change';
export const ALT_SELECT_OPEN_CHANGE_EVENT = 'alt-open-change';
