import type { AltSelectOption } from './types';

export type OptionView = {
	description: HTMLSpanElement;
	element: HTMLLIElement;
	label: HTMLSpanElement;
};

let optionId = 0;

const createOptionView = (document: Document): OptionView => {
	optionId += 1;
	const element = document.createElement('li');
	const text = document.createElement('span');
	const label = document.createElement('span');
	const description = document.createElement('span');
	element.className = 'alt-listbox__option';
	element.id = `alt-select-option-${optionId}`;
	element.setAttribute('role', 'option');
	text.className = 'alt-listbox__option-text';
	label.className = 'alt-listbox__option-label';
	description.className = 'alt-listbox__option-description';
	text.append(label, description);
	element.append(text);
	return { description, element, label };
};

const updateOptionView = (
	view: OptionView,
	option: AltSelectOption,
	activeValue: string | undefined,
	selectedValues: readonly string[],
): void => {
	view.element.dataset.active = String(option.value === activeValue);
	view.element.dataset.value = option.value;
	view.element.setAttribute('aria-disabled', String(option.disabled ?? false));
	view.element.setAttribute('aria-selected', String(selectedValues.includes(option.value)));
	view.label.textContent = option.label;
	view.description.hidden = !option.description;
	view.description.textContent = option.description ?? '';
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

	for (const option of options) {
		const view = views.get(option.value) ?? createOptionView(list.ownerDocument);
		views.set(option.value, view);
		updateOptionView(view, option, activeValue, selectedValues);
		list.append(view.element);
	}
};
