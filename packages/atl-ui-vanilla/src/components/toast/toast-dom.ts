import type { ToastRecord } from './toast-model';

export type ToastDom = {
	stack: HTMLUListElement;
};

export const createToastDom = (host: HTMLElement): ToastDom => {
	const stack = host.ownerDocument.createElement('ul');
	stack.className = 'alt-toast-region__stack';
	stack.setAttribute('aria-atomic', 'false');
	stack.setAttribute('aria-live', 'polite');
	stack.setAttribute('role', 'status');
	host.replaceChildren(stack);
	return {
		stack,
	};
};

const createToastItem = (document: Document): HTMLLIElement => {
	const item = document.createElement('li');
	const message = document.createElement('span');
	const dismiss = document.createElement('button');
	item.className = 'alt-toast';
	message.className = 'alt-toast__message';
	dismiss.className = 'alt-toast__dismiss';
	dismiss.type = 'button';
	dismiss.setAttribute('aria-label', 'Dismiss notification');
	dismiss.textContent = '\u00d7';
	item.append(message, dismiss);
	return item;
};

const updateToastItem = (item: HTMLLIElement, record: ToastRecord): void => {
	item.dataset.toastId = record.id;
	item.dataset.status = record.status;
	item.setAttribute('role', record.status === 'error' ? 'alert' : 'status');
	const message = item.querySelector<HTMLElement>('.alt-toast__message');
	const dismiss = item.querySelector<HTMLButtonElement>('.alt-toast__dismiss');
	if (message) message.textContent = record.message;
	if (dismiss) dismiss.hidden = !record.dismissible;
};

export const syncToastDom = (dom: ToastDom, records: ToastRecord[]): void => {
	const existing = new Map(
		Array.from(dom.stack.children).map((child) => {
			const item = child as HTMLLIElement;
			return [item.dataset.toastId ?? '', item];
		}),
	);

	for (const record of records) {
		const item = existing.get(record.id) ?? createToastItem(dom.stack.ownerDocument);
		existing.delete(record.id);
		updateToastItem(item, record);
		dom.stack.append(item);
	}

	for (const item of existing.values()) item.remove();
};
