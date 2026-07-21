import { type ElementEnvironment, registerElement } from '../../core';
import { defineAltDropdown } from '../dropdown';
import { defineAltInput } from '../input';
import { defineAltPopup } from '../popup';

import { createAltAutocompleteElementClass } from './autocomplete-element';

export { createAltAutocompleteElementClass } from './autocomplete-element';
export type {
	AltAutocompleteChangeReason,
	AltAutocompleteChangeDetail,
	AltAutocompleteElementApi,
	AltAutocompleteFilter,
	AltAutocompleteInputDetail,
	AltAutocompleteOpenChangeDetail,
	AltAutocompleteOption,
} from './types';

export const defineAltAutocomplete = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	defineAltInput(environment);
	defineAltPopup(environment);
	defineAltDropdown(environment);
	return registerElement('alt-autocomplete', createAltAutocompleteElementClass, environment);
};
