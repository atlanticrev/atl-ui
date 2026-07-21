import { createSelectCarrier } from '../../controllers';
import { createAltIcon } from '../../icons';
import { ensureFieldOutlineDom } from '../field-outline/field-outline-dom';

export type SelectDom = {
	carrier: HTMLSelectElement;
	description: HTMLDivElement;
	indicator: HTMLElement | null;
	label: HTMLElement | null;
	leadingIcon: HTMLElement | null;
	list: HTMLUListElement;
	outline: SVGSVGElement | null;
	outlinePath: SVGPathElement | null;
	popup: HTMLDivElement;
	trigger: HTMLElement;
	value: HTMLElement | null;
};

let selectId = 0;

const nextIds = (): { description: string; label: string; list: string } => {
	selectId += 1;
	return {
		description: `alt-select-description-${selectId}`,
		label: `alt-select-label-${selectId}`,
		list: `alt-select-list-${selectId}`,
	};
};

const createSpan = (document: Document, className: string): HTMLSpanElement => {
	const span = document.createElement('span');
	span.className = className;
	return span;
};

const findAuthoredTrigger = (host: HTMLElement): HTMLElement | null => {
	const candidates = host.querySelectorAll<HTMLElement>('[data-alt-select-trigger]');
	return Array.from(candidates).find((element) => element.closest('alt-select') === host) ?? null;
};

export const configureSelectTrigger = (trigger: HTMLElement, listId: string): void => {
	if (trigger.localName === 'button') {
		(trigger as HTMLButtonElement).type = 'button';
	} else if (trigger.tabIndex < 0) {
		trigger.tabIndex = 0;
	}

	trigger.setAttribute('role', 'combobox');
	trigger.setAttribute('aria-haspopup', 'listbox');
	trigger.setAttribute('aria-controls', listId);
};

export const readSelectTriggerParts = (
	trigger: HTMLElement,
): Pick<SelectDom, 'indicator' | 'label' | 'leadingIcon' | 'value'> => ({
	indicator: trigger.querySelector<HTMLElement>('[data-alt-select-indicator]'),
	label: trigger.querySelector<HTMLElement>('[data-alt-select-label]'),
	leadingIcon: trigger.querySelector<HTMLElement>('[data-alt-select-leading-icon]'),
	value: trigger.querySelector<HTMLElement>('[data-alt-select-value]'),
});

export const createSelectDom = (host: HTMLElement): SelectDom => {
	const document = host.ownerDocument;
	const ids = nextIds();
	const authoredTrigger = findAuthoredTrigger(host);
	const trigger = authoredTrigger ?? document.createElement('button');
	let label = authoredTrigger?.querySelector<HTMLElement>('[data-alt-select-label]') ?? null;
	let value = authoredTrigger?.querySelector<HTMLElement>('[data-alt-select-value]') ?? null;
	let indicator = authoredTrigger?.querySelector<HTMLElement>('[data-alt-select-indicator]') ?? null;
	let leadingIcon = authoredTrigger?.querySelector<HTMLElement>('[data-alt-select-leading-icon]') ?? null;
	const popup = document.createElement('div');
	const list = document.createElement('ul');
	const description = document.createElement('div');
	const carrier = createSelectCarrier(document);
	let outline: SVGSVGElement | null = null;
	let outlinePath: SVGPathElement | null = null;

	if (!authoredTrigger) {
		label = createSpan(document, 'alt-select__label');
		leadingIcon = createSpan(document, 'alt-select__leading-icon');
		value = createSpan(document, 'alt-select__value');
		indicator = createSpan(document, 'alt-select__indicator');
		trigger.className = 'alt-select__trigger';
		trigger.dataset.altOwned = 'select-trigger';
		label.id = ids.label;
		indicator.append(createAltIcon(document, 'chevron-down', { size: 18 }));
		indicator.setAttribute('aria-hidden', 'true');
		leadingIcon.setAttribute('aria-hidden', 'true');
		leadingIcon.hidden = true;
		trigger.append(label, leadingIcon, value, indicator);
		({ outline, outlinePath } = ensureFieldOutlineDom(trigger, {
			outline: 'alt-select__outline',
			path: 'alt-select__outline-path',
		}));
	}

	configureSelectTrigger(trigger, ids.list);
	popup.className = 'alt-select__popup alt-popup';
	popup.setAttribute('popover', 'manual');
	list.className = 'alt-listbox';
	list.id = ids.list;
	list.setAttribute('role', 'listbox');
	description.className = 'alt-select__helper';
	description.id = ids.description;
	carrier.className = 'alt-select__native';
	popup.append(list);

	if (!authoredTrigger) {
		host.prepend(trigger);
	}

	host.append(popup, description, carrier);
	return {
		carrier, description, indicator, label, leadingIcon, list,
		outline, outlinePath, popup, trigger, value,
	};
};
