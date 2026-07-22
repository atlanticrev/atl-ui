import { createAltIcon } from '../../icons';

export type SearchDom = {
	clear: HTMLButtonElement;
	field: HTMLInputElement;
	label: HTMLLabelElement;
};

let searchId = 0;

export const createSearchDom = (host: HTMLElement): SearchDom => {
	const document = host.ownerDocument;

	const label = document.createElement('label');

	const icon = createAltIcon(document, 'search', { className: 'alt-search__icon', size: 16 });

	const field = document.createElement('input');

	const clear = document.createElement('button');

	field.id = host.id ? `${host.id}-field` : `alt-search-${++searchId}`;

	field.type = 'search';

	field.className = 'alt-search__field';

	clear.type = 'button';

	clear.className = 'alt-button alt-search__clear';

	clear.dataset.elevation = 'none';

	clear.dataset.iconOnly = '';

	clear.dataset.size = '24';

	clear.dataset.variant = 'text';

	clear.append(createAltIcon(document, 'close', { size: 16 }));

	clear.setAttribute('aria-label', 'Clear search');

	label.className = 'alt-search__root';

	label.append(icon, field, clear);

	host.replaceChildren(label);

	return { clear, field, label };
};
