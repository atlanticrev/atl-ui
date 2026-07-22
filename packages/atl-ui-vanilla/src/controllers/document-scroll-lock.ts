type StylePropertySnapshot = {
	name: string;
	priority: string;
	value: string;
};

type ScrollLockState = {
	count: number;
	restore: () => void;
};

const LOCKED_PROPERTIES = [
	['overflow', 'hidden'],
	['overscroll-behavior', 'none'],
] as const;

const locks = new WeakMap<Document, ScrollLockState>();

const lockElement = (element: HTMLElement): (() => void) => {
	const snapshots: StylePropertySnapshot[] = LOCKED_PROPERTIES.map(([name]) => ({
		name,
		priority: element.style.getPropertyPriority(name),
		value: element.style.getPropertyValue(name),
	}));

	for (const [name, value] of LOCKED_PROPERTIES) element.style.setProperty(name, value, 'important');

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
		const restoreRoot = lockElement(document.documentElement);

		const restoreBody = document.body ? lockElement(document.body) : (): void => undefined;

		state = {
			count: 0,
			restore: () => {
				restoreBody();

				restoreRoot();
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
