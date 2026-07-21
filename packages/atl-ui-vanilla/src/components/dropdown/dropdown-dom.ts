export type DropdownDom = {
	empty: HTMLLIElement;
	emptyIcon: HTMLSpanElement;
	emptyText: HTMLSpanElement;
	footer: HTMLDivElement;
	footerText: HTMLSpanElement;
	list: HTMLUListElement;
	selectAll: HTMLButtonElement;
};

export const createDropdownDom = (host: HTMLElement): DropdownDom => {
	const list = host.ownerDocument.createElement('ul');
	const empty = host.ownerDocument.createElement('li');
	const emptyIcon = host.ownerDocument.createElement('span');
	const emptyText = host.ownerDocument.createElement('span');
	const footer = host.ownerDocument.createElement('div');
	const footerText = host.ownerDocument.createElement('span');
	const selectAll = host.ownerDocument.createElement('button');
	list.className = 'alt-listbox';
	list.role = 'listbox';
	list.tabIndex = 0;
	empty.className = 'alt-listbox__empty';
	empty.role = 'option';
	emptyIcon.className = 'alt-listbox__empty-icon';
	emptyIcon.setAttribute('aria-hidden', 'true');
	emptyText.className = 'alt-listbox__empty-text';
	footer.className = 'alt-listbox__footer';
	footerText.className = 'alt-listbox__footer-text';
	selectAll.className = 'alt-listbox__select-all';
	selectAll.type = 'button';
	footer.append(footerText, selectAll);
	empty.append(emptyIcon, emptyText);
	list.append(empty);
	host.replaceChildren(list, footer);
	return {
		empty,
		emptyIcon,
		emptyText,
		footer,
		footerText,
		list,
		selectAll,
	};
};
