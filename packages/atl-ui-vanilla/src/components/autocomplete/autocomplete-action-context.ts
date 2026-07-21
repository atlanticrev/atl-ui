import type { OpenChangeReason } from '../../controllers';

import type { AutocompleteDom } from './autocomplete-dom';
import type { AltAutocompleteOption } from './types';

export type AutocompleteActionContext = {
	commit: (values: readonly string[], inputValue: string, pristine: boolean) => void;
	dom: () => AutocompleteDom | undefined;
	host: HTMLElement;
	inputPattern: () => RegExp | null;
	inputValue: () => string;
	isOpen: () => boolean;
	options: () => readonly AltAutocompleteOption[];
	refreshOptions: () => void;
	requestOpen: (open: boolean, reason: OpenChangeReason, event?: Event) => void;
	values: () => readonly string[];
};
