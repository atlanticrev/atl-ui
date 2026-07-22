import { syncAltIconContent } from '../../icons';

import type { AutocompleteDom } from './autocomplete-dom';
import type { AltAutocompleteElementApi } from './types';

type AutocompleteIconApi = Pick<AltAutocompleteElementApi, 'clearIcon' | 'indicatorIcon' | 'noResultsIcon'>;

const syncOwnedAction = (
	action: HTMLElement,
	ownedName: string,
	icon: Node | null | undefined,
	fallback: 'chevron-down' | 'close',
): void => {
	if (action.dataset.altOwned !== ownedName) return;

	syncAltIconContent(action, icon, fallback, { size: 18 });
};

export const syncAutocompleteIcons = (host: HTMLElement, dom: AutocompleteDom): void => {
	const icons = host as HTMLElement & AutocompleteIconApi;

	syncOwnedAction(dom.clear, 'autocomplete-clear', icons.clearIcon, 'close');

	syncOwnedAction(dom.trigger, 'autocomplete-trigger', icons.indicatorIcon, 'chevron-down');

	const emptyIcon = icons.noResultsIcon === undefined ? dom.defaultNoResultsIcon : icons.noResultsIcon;

	if (dom.dropdown.emptyIcon !== emptyIcon) dom.dropdown.emptyIcon = emptyIcon;
};
