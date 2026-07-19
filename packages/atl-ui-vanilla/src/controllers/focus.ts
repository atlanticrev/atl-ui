const DEFAULT_FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button',
	'input',
	'select',
	'textarea',
	'summary',
	'[contenteditable]:not([contenteditable="false"])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export type FocusDirection = 'first' | 'last' | 'next' | 'previous';

export type FocusNavigationOptions = {
	selector?: string;
	wrap?: boolean;
};

const isAvailable = (element: HTMLElement): boolean => {
	if (element.hidden || element.closest('[hidden], [inert], [aria-hidden="true"]')) {
		return false;
	}

	return element.tabIndex >= 0 && !element.matches(':disabled');
};

export const getFocusableElements = (container: ParentNode, selector = DEFAULT_FOCUSABLE_SELECTOR): HTMLElement[] =>
	Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(isAvailable);

const resolveIndex = (direction: FocusDirection, currentIndex: number, lastIndex: number, wrap: boolean): number => {
	if (direction === 'first') {
		return 0;
	}

	if (direction === 'last') {
		return lastIndex;
	}

	const delta = direction === 'next' ? 1 : -1;
	const fallback = direction === 'next' ? 0 : lastIndex;
	const nextIndex = currentIndex < 0 ? fallback : currentIndex + delta;

	if (wrap) {
		return (nextIndex + lastIndex + 1) % (lastIndex + 1);
	}

	return Math.min(lastIndex, Math.max(0, nextIndex));
};

export const moveFocus = (
	container: ParentNode,
	current: Element | null,
	direction: FocusDirection,
	options: FocusNavigationOptions = {},
): HTMLElement | null => {
	const elements = getFocusableElements(container, options.selector);

	if (elements.length === 0) {
		return null;
	}

	const currentIndex = elements.indexOf(current as HTMLElement);
	const index = resolveIndex(direction, currentIndex, elements.length - 1, options.wrap ?? true);
	const target = elements[index];
	target.focus();
	return target;
};

export type FocusRestorer = {
	restore: () => boolean;
};

export const captureFocus = (source: Document | Element): FocusRestorer => {
	const ownerDocument = source.nodeType === 9 ? (source as Document) : source.ownerDocument;
	const captured = ownerDocument?.activeElement ?? null;

	return {
		restore: (): boolean => {
			const view = ownerDocument?.defaultView;

			if (!ownerDocument || !view || !(captured instanceof view.HTMLElement) || !captured.isConnected) {
				return false;
			}

			captured.focus();
			return ownerDocument.activeElement === captured;
		},
	};
};
