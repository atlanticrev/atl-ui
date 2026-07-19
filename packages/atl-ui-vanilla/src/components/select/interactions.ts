import type { SelectDom } from './dom';

export type SelectInteractionCallbacks = {
	choose: (value: string) => void;
	close: () => void;
	isOpen: () => boolean;
	move: (direction: 1 | -1, edge?: 'end' | 'start') => void;
	open: () => void;
	refreshOptions: () => void;
	selectActive: () => void;
	toggle: () => void;
};

const optionValueFromEvent = (event: Event, list: HTMLElement): string | undefined => {
	const target = event.target as Element | null;
	const option = target?.closest<HTMLElement>('[role="option"]');
	return option && list.contains(option) ? option.dataset.value : undefined;
};

const isOptionMutation = (record: MutationRecord): boolean => {
	const target = record.target.nodeType === 1 ? (record.target as Element) : record.target.parentElement;

	if (target?.closest('alt-option')) {
		return true;
	}

	return (
		Array.from(record.addedNodes).some((node) => (node as Element).localName === 'alt-option') ||
		Array.from(record.removedNodes).some((node) => (node as Element).localName === 'alt-option')
	);
};

const handleKeyDown = (event: KeyboardEvent, callbacks: SelectInteractionCallbacks): void => {
	const direction = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : undefined;

	if (direction) {
		callbacks.isOpen() ? callbacks.move(direction) : callbacks.open();
	} else if (event.key === 'Home' || event.key === 'End') {
		if (!callbacks.isOpen()) {
			return;
		}

		callbacks.move(event.key === 'Home' ? 1 : -1, event.key === 'Home' ? 'start' : 'end');
	} else if (event.key === 'Enter' || event.key === ' ') {
		callbacks.selectActive();
	} else if (event.key === 'Escape') {
		callbacks.close();
	} else if (event.key === 'Tab') {
		callbacks.close();
		return;
	} else {
		return;
	}

	event.preventDefault();
};

export const bindSelectInteractions = (
	host: HTMLElement,
	dom: SelectDom,
	callbacks: SelectInteractionCallbacks,
	signal: AbortSignal,
): void => {
	dom.trigger.addEventListener('click', callbacks.toggle, { signal });
	dom.trigger.addEventListener('keydown', (event) => handleKeyDown(event, callbacks), { signal });
	dom.list.addEventListener(
		'click',
		(event) => {
			const value = optionValueFromEvent(event, dom.list);

			if (value !== undefined) {
				callbacks.choose(value);
			}
		},
		{ signal },
	);
	const MutationObserverConstructor = host.ownerDocument.defaultView?.MutationObserver;
	const observer = MutationObserverConstructor
		? new MutationObserverConstructor((records) => {
				if (records.some(isOptionMutation)) {
					callbacks.refreshOptions();
				}
			})
		: undefined;
	observer?.observe(host, {
		attributeFilter: ['description', 'disabled', 'label', 'selected', 'value'],
		attributes: true,
		childList: true,
		characterData: true,
		subtree: true,
	});
	signal.addEventListener('abort', () => observer?.disconnect(), { once: true });
};
