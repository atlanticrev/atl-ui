import type { AutocompleteDom } from './autocomplete-dom';

export type AutocompleteCallbacks = {
	clear: (event: Event) => void;
	onFocus: (event: FocusEvent) => void;
	onInput: (event: Event) => void;
	onKeyDown: (event: KeyboardEvent) => void;
	onPopupClosed: (event: Event) => void;
	onRefreshOptions: () => void;
	onSelect: (event: Event) => void;
	onTrigger: (event: Event) => void;
};

const preventFocusLoss = (event: Event): void => event.preventDefault();

const bindAction = (element: HTMLElement, callback: (event: Event) => void, signal: AbortSignal): void => {
	element.addEventListener('pointerdown', preventFocusLoss, { signal });

	element.addEventListener('click', callback, { signal });

	element.addEventListener(
		'keydown',
		(event) => {
			if (event.target !== element || element.localName === 'button') return;

			if (event.key !== 'Enter' && event.key !== ' ') return;

			event.preventDefault();

			callback(event);
		},
		{ signal },
	);
};

const isOptionMutation = (record: MutationRecord): boolean => {
	const target = record.target.nodeType === 1 ? (record.target as Element) : record.target.parentElement;

	return Boolean(
		target?.closest('alt-option') ||
			Array.from(record.addedNodes).some((node) => (node as Element).localName === 'alt-option') ||
			Array.from(record.removedNodes).some((node) => (node as Element).localName === 'alt-option'),
	);
};

export const bindAutocompleteInteractions = (
	host: HTMLElement,
	dom: AutocompleteDom,
	callbacks: AutocompleteCallbacks,
	signal: AbortSignal,
): void => {
	dom.input.addEventListener('alt-input', (event) => event.stopPropagation(), { signal });

	dom.inputElement.addEventListener('input', callbacks.onInput, { signal });

	dom.inputElement.addEventListener('keydown', callbacks.onKeyDown, { signal });

	dom.inputElement.addEventListener('focus', callbacks.onFocus, { signal });

	dom.dropdown.addEventListener('alt-change', callbacks.onSelect, { signal });

	bindAction(dom.trigger, callbacks.onTrigger, signal);

	bindAction(dom.clear, callbacks.clear, signal);

	dom.popup.addEventListener(
		'alt-open-change',
		(event) => {
			event.stopPropagation();

			if (!(event as CustomEvent<{ open: boolean }>).detail.open) callbacks.onPopupClosed(event);
		},
		{ signal },
	);

	host.ownerDocument.addEventListener(
		'focusin',
		(event) => {
			queueMicrotask(() => {
				if (!host.contains(host.ownerDocument.activeElement)) callbacks.onPopupClosed(event);
			});
		},
		{ signal },
	);

	const Observer = host.ownerDocument.defaultView?.MutationObserver;

	const observer = Observer
		? new Observer((records) => {
				if (records.some(isOptionMutation)) callbacks.onRefreshOptions();
			})
		: undefined;

	observer?.observe(host, {
		attributeFilter: ['description', 'disabled', 'label', 'selected', 'value'],
		attributes: true,
		childList: true,
		subtree: true,
	});

	signal.addEventListener('abort', () => observer?.disconnect(), { once: true });
};
