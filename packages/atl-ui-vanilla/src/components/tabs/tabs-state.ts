import type { TabsDom } from './tabs-dom';
import { isTabDisabled } from './tabs-dom';

export const findInitialKey = (dom: TabsDom, requestedKey: string | null): string | null => {
	const requested = dom.tabs.find((tab) => tab.dataset.key === requestedKey && !isTabDisabled(tab));

	const selected = dom.tabs.find((tab) => tab.getAttribute('aria-selected') === 'true' && !isTabDisabled(tab));

	const fallback = dom.tabs.find((tab) => !isTabDisabled(tab));

	return (requested ?? selected ?? fallback)?.dataset.key ?? null;
};

export const syncTabsState = (dom: TabsDom, activeKey: string | null): void => {
	for (const tab of dom.tabs) {
		const selected = tab.dataset.key === activeKey;

		tab.setAttribute('aria-selected', String(selected));

		tab.tabIndex = selected ? 0 : -1;

		tab.toggleAttribute('data-active', selected);
	}

	for (const panel of dom.panels) {
		panel.hidden = panel.dataset.key !== activeKey;
	}
};

export const getAdjacentTab = (dom: TabsDom, current: HTMLElement, offset: number): HTMLElement | undefined => {
	const enabledTabs = dom.tabs.filter((tab) => !isTabDisabled(tab));

	const currentIndex = enabledTabs.indexOf(current);

	if (currentIndex < 0 || enabledTabs.length === 0) {
		return undefined;
	}

	const nextIndex = (currentIndex + offset + enabledTabs.length) % enabledTabs.length;

	return enabledTabs[nextIndex];
};

export const getKeyboardTab = (
	dom: TabsDom,
	current: HTMLElement,
	key: string,
	orientation: string,
): HTMLElement | undefined => {
	const enabledTabs = dom.tabs.filter((tab) => !isTabDisabled(tab));

	if (key === 'Home') return enabledTabs[0];

	if (key === 'End') return enabledTabs.at(-1);

	if (key === 'ArrowLeft' || (orientation === 'vertical' && key === 'ArrowUp')) {
		return getAdjacentTab(dom, current, -1);
	}

	if (key === 'ArrowRight' || (orientation === 'vertical' && key === 'ArrowDown')) {
		return getAdjacentTab(dom, current, 1);
	}

	return undefined;
};
