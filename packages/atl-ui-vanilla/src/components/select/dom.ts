import { createSelectCarrier } from '../../controllers';

export type SelectDom = {
	carrier: HTMLSelectElement;
	description: HTMLDivElement;
	indicator: HTMLSpanElement;
	label: HTMLSpanElement;
	list: HTMLUListElement;
	popup: HTMLDivElement;
	trigger: HTMLButtonElement;
	value: HTMLSpanElement;
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

export const createSelectDom = (host: HTMLElement): SelectDom => {
	const document = host.ownerDocument;
	const ids = nextIds();
	const trigger = document.createElement('button');
	const label = createSpan(document, 'alt-select__label');
	const value = createSpan(document, 'alt-select__value');
	const indicator = createSpan(document, 'alt-select__indicator');
	const popup = document.createElement('div');
	const list = document.createElement('ul');
	const description = document.createElement('div');
	const carrier = createSelectCarrier(document);

	trigger.className = 'alt-select__trigger';
	trigger.type = 'button';
	trigger.setAttribute('role', 'combobox');
	trigger.setAttribute('aria-haspopup', 'listbox');
	trigger.setAttribute('aria-controls', ids.list);
	label.id = ids.label;
	indicator.textContent = '⌄';
	indicator.setAttribute('aria-hidden', 'true');
	popup.className = 'alt-select__popup alt-popup';
	popup.setAttribute('popover', 'manual');
	list.className = 'alt-listbox';
	list.id = ids.list;
	list.setAttribute('role', 'listbox');
	description.className = 'alt-select__helper';
	description.id = ids.description;
	carrier.className = 'alt-select__native';
	trigger.append(label, value, indicator);
	popup.append(list);
	host.append(trigger, popup, description, carrier);
	return { carrier, description, indicator, label, list, popup, trigger, value };
};
