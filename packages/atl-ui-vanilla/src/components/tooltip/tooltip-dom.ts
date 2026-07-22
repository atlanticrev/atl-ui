let nextTooltipId = 0;

export type TooltipDom = {
	panel: HTMLSpanElement;
};

export const createTooltipDom = (host: HTMLElement): TooltipDom => {
	const panel = host.ownerDocument.createElement('span');

	panel.className = 'alt-tooltip__panel';

	panel.hidden = true;

	panel.id = `alt-tooltip-${++nextTooltipId}`;

	panel.role = 'tooltip';

	host.append(panel);

	return { panel };
};

export const findTooltipTrigger = (host: HTMLElement, panel: Element): HTMLElement | null => {
	return Array.from(host.children).find((child) => child !== panel) as HTMLElement | null;
};
