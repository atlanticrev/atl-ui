export const flushToastUpdates = async (): Promise<void> => {
	await Promise.resolve();
};

const dispatchAnimationEnd = (element: Element, animationName: string): void => {
	const event = new Event('animationend', {
		bubbles: true,
	});

	Object.defineProperty(event, 'animationName', {
		value: animationName,
	});

	element.dispatchEvent(event);
};

export const getToastItem = (region: Element, id: string): HTMLElement => {
	const item = region.querySelector<HTMLElement>(`.alt-toast-region__item[data-toast-id="${id}"]`);

	if (!item) throw new Error(`Missing toast item: ${id}`);

	return item;
};

export const finishToastEnter = async (region: Element, id: string): Promise<void> => {
	const item = getToastItem(region, id);

	dispatchAnimationEnd(item, 'alt-toast-expand');

	await flushToastUpdates();
};

export const finishToastClose = async (region: Element, id: string): Promise<void> => {
	const item = getToastItem(region, id);

	const toast = item.querySelector('.alt-toast');

	if (!toast) throw new Error(`Missing toast content: ${id}`);

	dispatchAnimationEnd(toast, 'alt-toast-exit');

	await flushToastUpdates();

	dispatchAnimationEnd(item, 'alt-toast-collapse');

	await flushToastUpdates();
};
