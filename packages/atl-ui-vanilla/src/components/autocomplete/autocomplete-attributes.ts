import { configureSelectCarrier, setSelectCarrierValues } from '../../controllers';

import type { AutocompleteDom } from './autocomplete-dom';
import { readAutocompleteBoolean } from './autocomplete-config';
import { syncInputHostAttributes } from './autocomplete-input';

export const AUTOCOMPLETE_OBSERVED_ATTRIBUTES = [
	'clear-on-blur',
	'clear-on-escape',
	'close-on-select',
	'disabled',
	'flip',
	'form',
	'free-solo',
	'helper-text',
	'label',
	'loading',
	'loading-text',
	'max-dropdown-height',
	'multiple',
	'name',
	'no-results-text',
	'open',
	'open-on-focus',
	'placeholder',
	'readonly',
	'required',
	'search-placeholder',
	'size',
	'status',
	'value',
];

export const syncAutocompleteAttributes = (
	host: HTMLElement,
	dom: AutocompleteDom,
	values: readonly string[],
): void => {
	syncInputHostAttributes(host, dom.input);
	const open = host.hasAttribute('open') && !host.hasAttribute('disabled');
	const searchPlaceholder = host.getAttribute('search-placeholder');
	const placeholder = open && searchPlaceholder !== null
		? searchPlaceholder
		: (host.getAttribute('placeholder') ?? '');
	dom.input.setAttribute('placeholder', placeholder);
	dom.dropdown.emptyText = host.hasAttribute('loading')
		? (host.getAttribute('loading-text') ?? 'Loading…')
		: (host.getAttribute('no-results-text') ?? 'No results found');
	dom.dropdown.setAttribute('max-height', host.getAttribute('max-dropdown-height') ?? '212');
	dom.dropdown.multiple = host.hasAttribute('multiple');
	dom.popup.flip = readAutocompleteBoolean(host, 'flip', true);
	dom.popup.open = open;
	dom.trigger.setAttribute('aria-controls', dom.dropdown.id);
	dom.trigger.setAttribute('aria-expanded', String(dom.popup.open));
	dom.trigger.setAttribute('aria-haspopup', 'listbox');
	dom.trigger.toggleAttribute('disabled', host.hasAttribute('disabled'));
	dom.trigger.toggleAttribute('data-popup-open', dom.popup.open);
	configureSelectCarrier(dom.carrier, {
		disabled: host.hasAttribute('disabled'),
		form: host.getAttribute('form') ?? undefined,
		multiple: host.hasAttribute('multiple'),
		name: host.getAttribute('name') ?? undefined,
		required: host.hasAttribute('required'),
	});
	setSelectCarrierValues(dom.carrier, values);
};
