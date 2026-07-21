import type { AutocompleteDom } from './autocomplete-dom';
import type { AutocompleteStateSnapshot } from './autocomplete-state';

export const bindAutocompleteForm = (
	host: HTMLElement,
	dom: AutocompleteDom,
	getDefaults: () => AutocompleteStateSnapshot,
	commit: (values: readonly string[], inputValue: string, pristine: boolean) => void,
	signal: AbortSignal,
): void => {
	dom.carrier.addEventListener(
		'invalid',
		(event) => {
			event.preventDefault();
			dom.inputElement.focus();
		},
		{ signal },
	);
	host.ownerDocument.addEventListener(
		'reset',
		(event) => {
			if (event.target !== dom.carrier.form) return;
			const defaults = getDefaults();
			queueMicrotask(() => commit(defaults.values, defaults.inputValue, true));
		},
		{ signal },
	);
};
