type DismissHandler = (id: string) => void;
type PauseHandler = (id: string, paused: boolean) => void;

const findItem = (host: HTMLElement, event: Event): HTMLElement | undefined => {
	const target = event.target as Element | null;
	const item = target?.closest?.<HTMLElement>('.alt-toast');
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
): void => {
	const handleClick = (event: Event): void => {
		const target = event.target as Element | null;
		if (!target?.closest?.('.alt-toast__dismiss')) return;
		const id = findItem(host, event)?.dataset.toastId;
		if (id) onDismiss(id);
	};
	const handlePause = (event: Event): void => {
		const id = findItem(host, event)?.dataset.toastId;
		if (id) onPause(id, true);
	};
	const handleResume = (event: Event): void => {
		const item = findItem(host, event);
		if (!item || movedWithinItem(host, item, event)) return;
		const id = item.dataset.toastId;
		if (id) onPause(id, false);
	};

	host.addEventListener('click', handleClick, {
		signal,
	});
	for (const type of ['mouseover', 'focusin']) {
		host.addEventListener(type, handlePause, {
			signal,
		});
	}
	for (const type of ['mouseout', 'focusout']) {
		host.addEventListener(type, handleResume, {
			signal,
		});
	}
};
