import { setAltIcon } from '../../icons';

export const getCollapseItems = (host: HTMLElement): HTMLDetailsElement[] => {
	return Array.from(host.querySelectorAll<HTMLDetailsElement>(':scope > details'));
};

export const getCollapseItemKey = (item: HTMLDetailsElement, index: number): string => {
	return item.dataset.key || String(index);
};

export const syncCollapseItem = (item: HTMLDetailsElement, index: number, open = item.open): void => {
	item.classList.add('alt-collapse__item');

	item.dataset.key ||= String(index);

	const summary = item.querySelector<HTMLElement>(':scope > summary');

	if (!summary) return;

	summary.classList.add('alt-collapse__summary');

	let indicator = summary.querySelector<HTMLElement>(':scope > [data-alt-owned="collapse-indicator"]');

	if (!indicator) {
		indicator = item.ownerDocument.createElement('span');

		indicator.className = 'alt-collapse__indicator';

		indicator.dataset.altOwned = 'collapse-indicator';

		indicator.setAttribute('aria-hidden', 'true');

		summary.append(indicator);
	}

	setAltIcon(indicator, open ? 'minus' : 'plus', { size: 20 });
};
