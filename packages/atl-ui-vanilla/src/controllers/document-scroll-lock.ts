type StylePropertySnapshot = {
	name: string;
	priority: string;
	value: string;
};

type ScrollLockState = {
	count: number;
	restore: () => void;
};

type LockedProperty = readonly [name: string, value: string];

const SCROLLING_ELEMENT_PROPERTIES: readonly LockedProperty[] = [['overflow', 'hidden']];

const OVERSCROLL_PROPERTIES: readonly LockedProperty[] = [['overscroll-behavior', 'none']];

const locks = new WeakMap<Document, ScrollLockState>();

const lockElement = (element: HTMLElement, properties: readonly LockedProperty[]): (() => void) => {
	const snapshots: StylePropertySnapshot[] = properties.map(([name]) => ({
		name,
		priority: element.style.getPropertyPriority(name),
		value: element.style.getPropertyValue(name),
	}));

	for (const [name, value] of properties) element.style.setProperty(name, value, 'important');

	return (): void => {
		for (const { name, priority, value } of snapshots) {
			if (value) element.style.setProperty(name, value, priority);
			else element.style.removeProperty(name);
		}
	};
};

export const lockDocumentScroll = (document: Document): (() => void) => {
	let state = locks.get(document);

	if (!state) {
		const root = document.documentElement;

		const body = document.body;

		const HtmlElementConstructor = document.defaultView?.HTMLElement;

		const scrollingElement =
			HtmlElementConstructor && document.scrollingElement instanceof HtmlElementConstructor
				? document.scrollingElement
				: root;

		const restoreScrollingElement = lockElement(scrollingElement, SCROLLING_ELEMENT_PROPERTIES);

		const restoreRootOverscroll = lockElement(root, OVERSCROLL_PROPERTIES);

		const restoreBodyOverscroll = body ? lockElement(body, OVERSCROLL_PROPERTIES) : (): void => undefined;

		state = {
			count: 0,
			restore: () => {
				restoreBodyOverscroll();

				restoreRootOverscroll();

				restoreScrollingElement();
			},
		};

		locks.set(document, state);
	}

	state.count += 1;

	let released = false;

	return (): void => {
		if (released) return;

		released = true;

		if (!state) return;

		state.count -= 1;

		if (state.count > 0) return;

		state.restore();

		locks.delete(document);
	};
};
