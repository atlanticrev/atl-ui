import type { AltInputElementApi } from '../input';

import { syncAutocompleteAttributes } from './autocomplete-attributes';
import type { AutocompleteDom } from './autocomplete-dom';
import { syncAutocompleteIcons } from './autocomplete-icons';
import { setInputValue } from './autocomplete-input';
import { filterAutocompleteOptions, findAutocompleteOption } from './autocomplete-options';
import type { AltAutocompleteFilter, AltAutocompleteOption } from './types';

export type AutocompleteViewState = {
	filter: AltAutocompleteFilter | null;
	inputPristine: boolean;
	inputValue: string;
	options: readonly AltAutocompleteOption[];
	values: readonly string[];
};

const syncInputAccessory = (dom: AutocompleteDom, selected: AltAutocompleteOption | undefined): void => {
	if (dom.input.localName !== 'alt-input') return;
	const input = dom.input as AltInputElementApi;
	input.leadingIcon = selected?.icon?.cloneNode(true) ?? null;
};

export const syncAutocompleteActiveDescendant = (dom: AutocompleteDom): void => {
	const active = dom.dropdown.querySelector<HTMLElement>('.alt-listbox__option[data-active="true"]');
	if (active) dom.inputElement.setAttribute('aria-activedescendant', active.id);
	else dom.inputElement.removeAttribute('aria-activedescendant');
};

export const renderAutocomplete = (host: HTMLElement, dom: AutocompleteDom, state: AutocompleteViewState): void => {
	syncAutocompleteAttributes(host, dom, state.values);
	syncAutocompleteIcons(host, dom);
	const selected = findAutocompleteOption(state.options, state.values[0] ?? '');
	const query = state.inputPristine ? '' : state.inputValue;
	const filtered = filterAutocompleteOptions(state.options, query, state.filter);
	setInputValue(dom.input, state.inputValue);
	dom.dropdown.options = host.hasAttribute('loading') && filtered.length === 0 ? [] : filtered;
	dom.dropdown.values = state.values;
	dom.clear.hidden = state.values.length === 0 && state.inputValue.length === 0;
	dom.clear.toggleAttribute('disabled', host.hasAttribute('disabled') || host.hasAttribute('readonly'));
	syncInputAccessory(dom, selected);
	dom.inputElement.setAttribute('role', 'combobox');
	dom.inputElement.setAttribute('aria-autocomplete', host.hasAttribute('free-solo') ? 'both' : 'list');
	dom.inputElement.setAttribute('aria-controls', dom.dropdown.id);
	dom.inputElement.setAttribute('aria-disabled', String(host.hasAttribute('disabled')));
	dom.inputElement.setAttribute('aria-expanded', String(host.hasAttribute('open')));
	dom.inputElement.setAttribute('aria-haspopup', 'listbox');
	dom.inputElement.setAttribute('aria-readonly', String(host.hasAttribute('readonly')));
	dom.inputElement.setAttribute('aria-required', String(host.hasAttribute('required')));
	dom.inputElement.setAttribute('autocomplete', 'off');
	dom.popup.style.minWidth = `${dom.input.getBoundingClientRect().width}px`;
	syncAutocompleteActiveDescendant(dom);
};
