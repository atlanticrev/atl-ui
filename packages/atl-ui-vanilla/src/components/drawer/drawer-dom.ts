export const createDrawerDom = (host: HTMLElement): HTMLDialogElement => {
	const existing = Array.from(host.children).find((child) => child.localName === 'dialog');

	if (existing) {
		existing.classList.add('alt-drawer');

		return existing as HTMLDialogElement;
	}

	const dialog = host.ownerDocument.createElement('dialog');

	dialog.className = 'alt-drawer';

	dialog.append(...Array.from(host.childNodes));

	host.append(dialog);

	return dialog;
};

export const syncDrawerAccessibility = (host: HTMLElement, dialog: HTMLDialogElement): void => {
	const attributes = {
		'aria-describedby': host.getAttribute('described-by'),
		'aria-label': host.getAttribute('label'),
		'aria-labelledby': host.getAttribute('labelled-by'),
	};

	for (const [name, value] of Object.entries(attributes)) {
		if (value === null) dialog.removeAttribute(name);
		else dialog.setAttribute(name, value);
	}
};
