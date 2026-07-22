export type SearchDom = {
	clear: HTMLButtonElement;
	field: HTMLInputElement;
	label: HTMLLabelElement;
};

let searchId = 0;

export const createSearchDom = (host: HTMLElement): SearchDom => {
	const document = host.ownerDocument;

	const label = document.createElement('label');

	const icon = document.createElement('span');

	const field = document.createElement('input');

	const clear = document.createElement('button');

	field.id = host.id ? `${host.id}-field` : `alt-search-${++searchId}`;

	field.type = 'search';

	field.className = 'alt-search__field';

	icon.className = 'alt-search__icon';

	icon.setAttribute('aria-hidden', 'true');

	clear.type = 'button';

	clear.className = 'alt-search__clear';

	clear.textContent = '×';

	clear.setAttribute('aria-label', 'Clear search');

	label.className = 'alt-search__root';

	label.append(icon, field, clear);

	host.replaceChildren(label);

	return { clear, field, label };
};
