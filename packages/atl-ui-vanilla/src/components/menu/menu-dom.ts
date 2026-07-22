export type MenuParts = {
	items: HTMLElement[];
	menu: HTMLElement | null;
	trigger: HTMLElement | null;
};

export const getMenuParts = (host: HTMLElement, currentMenu?: HTMLElement): MenuParts => {
	const menu = host.querySelector<HTMLElement>(':scope > [role="menu"]') ?? currentMenu ?? null;

	const trigger = host.querySelector<HTMLElement>(':scope > [data-alt-menu-trigger]');

	const items = menu
		? Array.from(menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')).filter(
				(item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
			)
		: [];

	return { items, menu, trigger };
};

export const configureMenuParts = (
	menu: HTMLElement,
	trigger: HTMLElement,
	items: HTMLElement[],
	open: boolean,
	id: string,
): void => {
	menu.classList.add('alt-menu__popup');

	menu.id ||= `${id}-popup`;

	menu.hidden = !open;

	trigger.setAttribute('aria-controls', menu.id);

	trigger.setAttribute('aria-expanded', String(open));

	trigger.setAttribute('aria-haspopup', 'menu');

	items.forEach((item) => {
		item.tabIndex = -1;
	});
};

export const getMenuNavigationIndex = (key: string, current: number, itemCount: number): number => {
	if (key === 'Home') return 0;

	if (key === 'End') return itemCount - 1;

	if (key === 'ArrowDown') return (current + 1) % itemCount;

	if (key === 'ArrowUp') return (current - 1 + itemCount) % itemCount;

	return current;
};
