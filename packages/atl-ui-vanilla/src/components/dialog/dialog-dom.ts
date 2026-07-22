export const createDialogDom = (host: HTMLElement): HTMLDialogElement => {
	const existing = Array.from(host.children).find((child) => child.localName === 'dialog');

	if (existing) {
		existing.classList.add('alt-dialog');

		return existing as HTMLDialogElement;
	}

	const dialog = host.ownerDocument.createElement('dialog');

	dialog.className = 'alt-dialog';

	dialog.append(...Array.from(host.childNodes));

	host.append(dialog);

	return dialog;
};
