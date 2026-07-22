import { createAltIcon } from '../../icons';

export type CalendarDom = {
	apply: HTMLButtonElement;
	grid: HTMLDivElement;
	heading: HTMLButtonElement;
	next: HTMLButtonElement;
	presets: HTMLDivElement;
	previous: HTMLButtonElement;
	reset: HTMLButtonElement;
	weekdays: HTMLDivElement;
};

const button = (document: Document, className: string, label: string): HTMLButtonElement => {
	const element = document.createElement('button');

	element.type = 'button';

	element.className = className;

	element.textContent = label;

	return element;
};

export const createCalendarDom = (host: HTMLElement): CalendarDom => {
	const document = host.ownerDocument;

	const header = document.createElement('header');

	const previous = button(document, 'alt-button alt-calendar__nav', '');

	const heading = button(document, 'alt-calendar__heading', '');

	const next = button(document, 'alt-button alt-calendar__nav', '');

	const weekdays = document.createElement('div');

	const grid = document.createElement('div');

	const presets = document.createElement('div');

	const footer = document.createElement('footer');

	const reset = button(document, 'alt-button', 'Reset');

	const apply = button(document, 'alt-button', 'Apply');

	previous.dataset.action = 'previous';

	previous.dataset.elevation = 'none';

	previous.dataset.iconOnly = '';

	previous.dataset.size = '32';

	previous.dataset.variant = 'text';

	previous.setAttribute('aria-label', 'Previous period');

	previous.append(createAltIcon(document, 'chevron-left', { size: 20 }));

	heading.dataset.action = 'change-view';

	next.dataset.action = 'next';

	next.dataset.elevation = 'none';

	next.dataset.iconOnly = '';

	next.dataset.size = '32';

	next.dataset.variant = 'text';

	next.setAttribute('aria-label', 'Next period');

	next.append(createAltIcon(document, 'chevron-right', { size: 20 }));

	weekdays.className = 'alt-calendar__weekdays';

	grid.className = 'alt-calendar__grid';

	grid.setAttribute('role', 'group');

	presets.className = 'alt-calendar__presets';

	footer.className = 'alt-calendar__footer';

	reset.dataset.action = 'reset';

	reset.dataset.elevation = 'none';

	reset.dataset.size = '32';

	reset.dataset.variant = 'text';

	apply.dataset.action = 'apply';

	apply.dataset.size = '32';

	apply.dataset.variant = 'filled';

	header.className = 'alt-calendar__header';

	header.append(previous, heading, next);

	footer.append(reset, apply);

	host.replaceChildren(presets, header, weekdays, grid, footer);

	return { apply, grid, heading, next, presets, previous, reset, weekdays };
};
