import { createSelectCarrier } from '../../controllers';
import { createAltIcon } from '../../icons';
import type { AltDropdownElementApi } from '../dropdown';
import type { AltInputElementApi } from '../input';
import type { AltPopupElementApi } from '../popup';

import { getNativeInput, type AutocompleteInput } from './autocomplete-input';

export type AutocompleteDom = {
	carrier: HTMLSelectElement;
	clear: HTMLElement;
	defaultNoResultsIcon: SVGSVGElement;
	dropdown: AltDropdownElementApi;
	input: AutocompleteInput;
	inputElement: HTMLInputElement;
	popup: AltPopupElementApi;
	trigger: HTMLElement;
};

let autocompleteId = 0;

const createAction = (document: Document, action: 'clear' | 'trigger'): HTMLButtonElement => {
	const button = document.createElement('button');

	button.className = `alt-autocomplete__${action}`;

	button.dataset[`altAutocomplete${action === 'clear' ? 'Clear' : 'Trigger'}`] = '';

	button.dataset.altOwned = `autocomplete-${action}`;

	button.type = 'button';

	button.tabIndex = -1;

	button.setAttribute('aria-label', action === 'clear' ? 'Clear selection' : 'Toggle options');

	const icon = action === 'clear' ? 'close' : 'chevron-down';

	button.append(createAltIcon(document, icon, { size: 18 }));

	return button;
};

const configureAction = (element: HTMLElement): void => {
	if (element.localName === 'button') {
		(element as HTMLButtonElement).type = 'button';

		return;
	}

	if (!element.hasAttribute('role')) element.setAttribute('role', 'button');

	if (element.tabIndex < 0) element.tabIndex = 0;
};

const findInput = (host: HTMLElement): AutocompleteInput | null => {
	return host.querySelector<AutocompleteInput>('[data-alt-autocomplete-input]');
};

const ensureInput = (host: HTMLElement): AutocompleteInput => {
	const authored = findInput(host);

	if (authored) return authored;

	const input = host.ownerDocument.createElement('alt-input') as AltInputElementApi;

	input.classList.add('alt-autocomplete__input');

	input.dataset.altAutocompleteInput = '';

	input.dataset.altOwned = 'autocomplete-input';

	host.prepend(input);

	return input;
};

const ensurePopup = (host: HTMLElement): AltPopupElementApi => {
	const authored = host.querySelector<AltPopupElementApi>('[data-alt-autocomplete-popup]');

	const popup = authored ?? (host.ownerDocument.createElement('alt-popup') as AltPopupElementApi);

	popup.classList.add('alt-autocomplete__popup');

	popup.dataset.altAutocompletePopup = '';

	if (!authored) host.append(popup);

	return popup;
};

export const createAutocompleteDom = (host: HTMLElement): AutocompleteDom => {
	const document = host.ownerDocument;

	const input = ensureInput(host);

	const inputElement = getNativeInput(input);

	if (!inputElement) throw new Error('alt-autocomplete requires a native input or alt-input');

	const popup = ensurePopup(host);

	const dropdown =
		popup.querySelector<AltDropdownElementApi>('alt-dropdown') ??
		(document.createElement('alt-dropdown') as AltDropdownElementApi);

	const trigger =
		host.querySelector<HTMLElement>('[data-alt-autocomplete-trigger]') ?? createAction(document, 'trigger');

	const clear = host.querySelector<HTMLElement>('[data-alt-autocomplete-clear]') ?? createAction(document, 'clear');

	const carrier = host.querySelector<HTMLSelectElement>('.alt-autocomplete__native') ?? createSelectCarrier(document);

	const defaultNoResultsIcon = createAltIcon(document, 'search', { size: 20 });

	input.classList.add('alt-autocomplete__input');

	dropdown.classList.add('alt-autocomplete__dropdown');

	dropdown.id ||= `${host.id || `alt-autocomplete-${++autocompleteId}`}-listbox`;

	carrier.classList.add('alt-autocomplete__native');

	configureAction(trigger);

	configureAction(clear);

	if (!dropdown.isConnected) popup.append(dropdown);

	if (!trigger.isConnected) host.append(trigger);

	if (!clear.isConnected) host.append(clear);

	if (!carrier.isConnected) host.append(carrier);

	popup.anchor = host;

	return { carrier, clear, defaultNoResultsIcon, dropdown, input, inputElement, popup, trigger };
};
