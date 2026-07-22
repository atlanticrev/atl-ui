import type { OpenChangeReason } from '../../controllers';

import { AutocompleteActions } from './autocomplete-actions';
import type { AutocompleteDom } from './autocomplete-dom';
import type { AltAutocompleteOption } from './types';

type AutocompleteActionHost = HTMLElement & {
	autocompleteDom: AutocompleteDom | undefined;
	inputPatternValue: RegExp | null;
	inputValueState: string;
	optionsValue: readonly AltAutocompleteOption[];
	valuesState: string[];
};

export type AutocompleteActionBridges = {
	commit: (values: readonly string[], inputValue: string, pristine: boolean) => void;
	isOpen: () => boolean;
	refreshOptions: () => void;
	requestOpen: (open: boolean, reason: OpenChangeReason, event?: Event) => void;
};

export const createAutocompleteActions = (
	host: AutocompleteActionHost,
	bridges: AutocompleteActionBridges,
): AutocompleteActions =>
	new AutocompleteActions({
		commit: bridges.commit,
		dom: () => host.autocompleteDom,
		host,
		inputPattern: () => host.inputPatternValue,
		inputValue: () => host.inputValueState,
		isOpen: bridges.isOpen,
		options: () => host.optionsValue,
		refreshOptions: bridges.refreshOptions,
		requestOpen: bridges.requestOpen,
		values: () => host.valuesState,
	});
