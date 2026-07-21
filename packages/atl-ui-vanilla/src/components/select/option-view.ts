import { createAltIcon, syncAltIconContent } from '../../icons';

import type { AltSelectOption } from './types';

type OptionParts = {
	check: HTMLElement;
	description: HTMLElement;
	icon: HTMLElement;
	label: HTMLElement;
};

export type OptionView = {
	element: HTMLElement;
	parts?: OptionParts;
};

let optionId = 0;

const createPart = (document: Document, className: string): HTMLSpanElement => {
	const part = document.createElement('span');
	part.className = className;
	return part;
};

const createParts = (element: HTMLElement): OptionParts => {
	const document = element.ownerDocument;
	const icon = createPart(document, 'alt-listbox__option-icon');
	const text = createPart(document, 'alt-listbox__option-text');
	const label = createPart(document, 'alt-listbox__option-label');
	const description = createPart(document, 'alt-listbox__option-description');
	const check = createPart(document, 'alt-listbox__option-check');
	icon.setAttribute('aria-hidden', 'true');
	check.setAttribute('aria-hidden', 'true');
	check.append(createAltIcon(document, 'check', { size: 18 }));
	text.append(label, description);
	element.append(icon, text, check);
	return { check, description, icon, label };
};

const createOptionView = (document: Document, option: AltSelectOption): OptionView => {
	optionId += 1;
	const element = option.element ?? document.createElement('li');
	const authoredContent = Boolean(option.element?.textContent?.trim() || option.element?.children.length);
	element.classList.add('alt-listbox__option');
	element.hidden = false;
	element.id ||= `alt-select-option-${optionId}`;
	element.tabIndex = -1;
	element.removeAttribute('aria-hidden');
	element.setAttribute('role', 'option');
	return {
		element,
		parts: authoredContent ? undefined : createParts(element),
	};
};

const updateOptionView = (
	view: OptionView,
	option: AltSelectOption,
	activeValue: string | undefined,
	selectedValues: readonly string[],
): void => {
	const selected = selectedValues.includes(option.value);
	view.element.dataset.active = String(option.value === activeValue);
	view.element.dataset.selected = String(selected);
	view.element.dataset.value = option.value;
	view.element.setAttribute('aria-disabled', String(option.disabled ?? false));
	view.element.setAttribute('aria-selected', String(selected));

	if (!view.parts) return;
	view.parts.icon.hidden = !option.icon;
	if (option.icon && view.parts.icon.firstChild !== option.icon) view.parts.icon.replaceChildren(option.icon);
	view.parts.label.textContent = option.label;
	view.parts.description.hidden = !option.description;
	view.parts.description.textContent = option.description ?? '';
	syncAltIconContent(view.parts.check, option.checkIcon, 'check', { size: 18 });
	view.parts.check.hidden = !selected || option.checkIcon === null;
};

const placeOption = (list: HTMLElement, view: OptionView, index: number): void => {
	const options = Array.from(list.children).filter((element) => element.classList.contains('alt-listbox__option'));
	const current = options[index];

	if (current !== view.element) {
		list.insertBefore(view.element, current ?? null);
	}
};

export const syncOptionViews = (
	list: HTMLUListElement,
	views: Map<string, OptionView>,
	options: readonly AltSelectOption[],
	activeValue: string | undefined,
	selectedValues: readonly string[],
): void => {
	const optionValues = new Set(options.map((option) => option.value));

	for (const [value, view] of views) {
		if (!optionValues.has(value)) {
			view.element.remove();
			views.delete(value);
		}
	}

	options.forEach((option, index) => {
		const view = views.get(option.value) ?? createOptionView(list.ownerDocument, option);
		views.set(option.value, view);
		updateOptionView(view, option, activeValue, selectedValues);
		placeOption(list, view, index);
	});
};
