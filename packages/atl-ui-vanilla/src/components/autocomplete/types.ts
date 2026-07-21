import type { OpenChangeReason } from '../../controllers';
import type { AltReplaceableIcon } from '../../icons';
import type { AltDropdownOption } from '../dropdown';

export type AltAutocompleteOption = AltDropdownOption;

export type AltAutocompleteFilter = (option: AltAutocompleteOption, query: string) => boolean;

export type AltAutocompleteChangeReason = 'clear' | 'create' | 'remove' | 'select';

export type AltAutocompleteChangeDetail = {
	option?: AltAutocompleteOption;
	reason: AltAutocompleteChangeReason;
	sourceEvent?: Event;
	value: string;
	values: readonly string[];
};

export type AltAutocompleteInputDetail = {
	reason: 'clear' | 'input' | 'reset' | 'selection';
	sourceEvent?: Event;
	value: string;
};

export type AltAutocompleteOpenChangeDetail = {
	open: boolean;
	reason: OpenChangeReason;
	sourceEvent?: Event;
};

export type AltAutocompleteElementApi = HTMLElement & {
	clearIcon: AltReplaceableIcon;
	clear: () => void;
	filter: AltAutocompleteFilter | null;
	form: HTMLFormElement | null;
	freeSolo: boolean;
	inputElement: HTMLInputElement | null;
	inputPattern: RegExp | null;
	inputValue: string;
	indicatorIcon: AltReplaceableIcon;
	multiple: boolean;
	noResultsIcon: AltReplaceableIcon;
	open: boolean;
	options: readonly AltAutocompleteOption[];
	readOnly: boolean;
	readonly triggerElement: HTMLElement | null;
	value: string;
	values: readonly string[];
	checkValidity: () => boolean;
	reportValidity: () => boolean;
	setCustomValidity: (message: string) => void;
	validationMessage: string;
	validity: ValidityState | null;
};
