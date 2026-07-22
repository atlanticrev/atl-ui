import { type AltIconName, createAltIcon, syncAltIconContent } from '../../icons';

import type { ToastRecord } from './toast-model';

export type ToastDom = {
	stack: HTMLUListElement;
};

const statusIcons: Record<ToastRecord['status'], AltIconName> = {
	error: 'error',
	info: 'info',
	success: 'check',
	warning: 'warning',
};

export const createToastDom = (host: HTMLElement): ToastDom => {
	const stack = host.ownerDocument.createElement('ul');

	stack.className = 'alt-toast-region__stack';

	host.replaceChildren(stack);

	return {
		stack,
	};
};

const createToastItem = (document: Document): HTMLLIElement => {
	const item = document.createElement('li');

	const collapse = document.createElement('div');

	const spacing = document.createElement('div');

	const toast = document.createElement('div');

	const icon = document.createElement('span');

	const message = document.createElement('span');

	const dismiss = document.createElement('button');

	item.className = 'alt-toast-region__item';

	collapse.className = 'alt-toast-region__collapse';

	spacing.className = 'alt-toast-region__spacing';

	toast.className = 'alt-toast';

	icon.className = 'alt-toast__icon';

	icon.setAttribute('aria-hidden', 'true');

	message.className = 'alt-toast__message';

	dismiss.className = 'alt-button alt-toast__dismiss';

	dismiss.dataset.elevation = 'none';

	dismiss.dataset.iconOnly = '';

	dismiss.dataset.size = '32';

	dismiss.dataset.variant = 'text';

	dismiss.type = 'button';

	dismiss.setAttribute('aria-label', 'Dismiss notification');

	dismiss.append(createAltIcon(document, 'close', { size: 16 }));

	toast.append(icon, message, dismiss);

	spacing.append(toast);

	collapse.append(spacing);

	item.append(collapse);

	return item;
};

const updateToastItem = (item: HTMLLIElement, record: ToastRecord): void => {
	const toast = item.querySelector<HTMLElement>('.alt-toast');

	const icon = item.querySelector<HTMLElement>('.alt-toast__icon');

	const message = item.querySelector<HTMLElement>('.alt-toast__message');

	const dismiss = item.querySelector<HTMLButtonElement>('.alt-toast__dismiss');

	item.dataset.state = record.phase;

	item.dataset.toastId = record.id;

	item.toggleAttribute('data-close-pending', Boolean(record.closeReason));

	if (toast) {
		toast.dataset.status = record.status;

		toast.dataset.toastId = record.id;

		toast.setAttribute('aria-atomic', 'true');

		toast.setAttribute('role', record.status === 'error' ? 'alert' : 'status');
	}

	if (icon) syncAltIconContent(icon, record.icon, statusIcons[record.status], { size: 16 });

	if (message) message.textContent = record.message;

	if (dismiss) {
		syncAltIconContent(dismiss, record.dismissIcon, 'close', { size: 16 });

		dismiss.disabled = Boolean(record.closeReason);

		dismiss.hidden = !record.dismissible;
	}
};

export const syncToastDom = (dom: ToastDom, records: ToastRecord[]): Map<string, HTMLLIElement> => {
	const existing = new Map<string, HTMLLIElement>();

	for (const child of Array.from(dom.stack.children)) {
		const item = child as HTMLLIElement;

		if (item.dataset.toastId) existing.set(item.dataset.toastId, item);
	}

	const rendered = new Map<string, HTMLLIElement>();

	let reference = dom.stack.firstElementChild;

	for (const record of records) {
		const item = existing.get(record.id) ?? createToastItem(dom.stack.ownerDocument);

		existing.delete(record.id);

		updateToastItem(item, record);

		if (item !== reference) dom.stack.insertBefore(item, reference);

		reference = item.nextElementSibling;

		rendered.set(record.id, item);
	}

	for (const item of existing.values()) item.remove();

	return rendered;
};
