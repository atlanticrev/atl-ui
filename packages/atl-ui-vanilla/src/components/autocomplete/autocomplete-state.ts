import { findAutocompleteOption } from './autocomplete-options';
import type { AltAutocompleteOption } from './types';

export type AutocompleteStateSnapshot = {
	inputValue: string;
	values: string[];
};

export class AutocompleteStateController {
	#defaultState: AutocompleteStateSnapshot = { inputValue: '', values: [] };
	#initialized = false;

	public get initialized(): boolean {
		return this.#initialized;
	}

	public initialize(state: AutocompleteStateSnapshot): boolean {
		if (this.#initialized) return false;

		this.#defaultState = {
			inputValue: state.inputValue,
			values: [...state.values],
		};

		this.#initialized = true;

		return true;
	}

	public get defaultState(): AutocompleteStateSnapshot {
		return {
			inputValue: this.#defaultState.inputValue,
			values: [...this.#defaultState.values],
		};
	}
}

export const readInitialAutocompleteValues = (
	host: HTMLElement,
	options: readonly AltAutocompleteOption[],
	current: readonly string[],
): string[] => {
	if (current.length > 0) return [...current];

	const attribute = host.getAttribute('value');

	if (attribute !== null) return attribute ? [attribute] : [];

	return options.filter((option) => option.selected).map((option) => option.value);
};

export const readAutocompleteSelectionLabel = (
	host: HTMLElement,
	options: readonly AltAutocompleteOption[],
	values: readonly string[],
): string => {
	const value = values[0] ?? '';

	const option = findAutocompleteOption(options, value);

	return option?.label ?? (host.hasAttribute('free-solo') ? value : '');
};
