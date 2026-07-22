import type { ToastPauseReason } from './toast-timer';

type DismissHandler = (id: string) => void;
type PauseHandler = (id: string, reason: ToastPauseReason, paused: boolean) => void;
type PauseAllHandler = (reason: ToastPauseReason, paused: boolean) => void;

const findItem = (host: HTMLElement, event: Event): HTMLElement | undefined => {
	const target = event.target as Element | null;

	const item = target?.closest?.<HTMLElement>('.alt-toast-region__item');

	return item && host.contains(item) ? item : undefined;
};

const movedWithinItem = (host: HTMLElement, item: HTMLElement, event: Event): boolean => {
	const related = (event as MouseEvent | FocusEvent).relatedTarget;

	const Node = host.ownerDocument.defaultView?.Node;

	return Boolean(related && Node && related instanceof Node && item.contains(related));
};

export const bindToastInteractions = (
	host: HTMLElement,
	signal: AbortSignal,
	onDismiss: DismissHandler,
	onPause: PauseHandler,
	onPauseAll: PauseAllHandler,
): void => {
	const handleClick = (event: Event): void => {
		const target = event.target as Element | null;

		if (!target?.closest?.('.alt-toast__dismiss')) return;

		const id = findItem(host, event)?.dataset.toastId;

		if (id) onDismiss(id);
	};

	const handlePointerEnter = (event: Event): void => {
		const id = findItem(host, event)?.dataset.toastId;

		if (id) onPause(id, 'pointer', true);
	};

	const handlePointerLeave = (event: Event): void => {
		const item = findItem(host, event);

		if (!item || movedWithinItem(host, item, event)) return;

		const id = item.dataset.toastId;

		if (id) onPause(id, 'pointer', false);
	};

	const handleFocusIn = (event: Event): void => {
		const id = findItem(host, event)?.dataset.toastId;

		if (id) onPause(id, 'focus', true);
	};

	const handleFocusOut = (event: Event): void => {
		const item = findItem(host, event);

		if (!item || movedWithinItem(host, item, event)) return;

		const id = item.dataset.toastId;

		if (id) onPause(id, 'focus', false);
	};

	host.addEventListener('click', handleClick, {
		signal,
	});

	host.addEventListener('mouseover', handlePointerEnter, { signal });

	host.addEventListener('mouseout', handlePointerLeave, { signal });

	host.addEventListener('focusin', handleFocusIn, { signal });

	host.addEventListener('focusout', handleFocusOut, { signal });

	const view = host.ownerDocument.defaultView;

	view?.addEventListener('blur', () => onPauseAll('window-blur', true), { signal });

	view?.addEventListener('focus', () => onPauseAll('window-blur', false), { signal });

	host.ownerDocument.addEventListener(
		'visibilitychange',
		() => onPauseAll('document-hidden', host.ownerDocument.hidden),
		{ signal },
	);

	signal.addEventListener(
		'abort',
		() => {
			onPauseAll('focus', false);

			onPauseAll('pointer', false);

			onPauseAll('window-blur', false);
		},
		{ once: true },
	);
};
