export type TabsDom = {
	panels: HTMLElement[];
	tabList: HTMLElement;
	tabs: HTMLElement[];
};

let nextTabsId = 0;

const createId = (host: HTMLElement, suffix: string): string => {
	const hostId = host.id || `alt-tabs-${++nextTabsId}`;

	if (!host.id) {
		host.id = hostId;
	}

	return `${hostId}-${suffix}`;
};

const getKey = (tab: HTMLElement, index: number): string => {
	return tab.dataset.key ?? tab.getAttribute('aria-controls') ?? tab.id ?? String(index);
};

export const collectTabsDom = (host: HTMLElement): TabsDom | undefined => {
	const tabs = Array.from(host.querySelectorAll<HTMLElement>('[role="tab"]'));
	const panels = Array.from(host.querySelectorAll<HTMLElement>('[role="tabpanel"]'));
	const tabList = host.querySelector<HTMLElement>('[role="tablist"]') ?? tabs[0]?.parentElement;

	if (!tabList || tabs.length === 0) {
		return undefined;
	}

	tabList.setAttribute('role', 'tablist');
	tabList.classList.add('alt-tabs__list');
	tabs.forEach((tab, index) => {
		const key = getKey(tab, index);
		const panel = panels.find((item) => item.dataset.key === key) ?? panels[index];
		if (tab.dataset.key !== key) {
			tab.dataset.key = key;
		}
		tab.id ||= createId(host, `tab-${index}`);
		tab.classList.add('alt-tabs__tab');

		if (panel) {
			if (panel.dataset.key !== key) {
				panel.dataset.key = key;
			}
			panel.id ||= createId(host, `panel-${index}`);
			tab.setAttribute('aria-controls', panel.id);
			panel.setAttribute('aria-labelledby', tab.id);
			panel.classList.add('alt-tabs__panel');
		}
	});

	return {
		panels,
		tabList,
		tabs,
	};
};

export const isTabDisabled = (tab: HTMLElement): boolean => {
	return tab.hasAttribute('disabled') || tab.getAttribute('aria-disabled') === 'true';
};
