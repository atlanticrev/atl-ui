import { configureSelectCarrier, setSelectCarrierValues } from '../../controllers';

import type { SelectDom } from './dom';
import { syncSelectCustomValidity } from './form-api';
import type { SelectModel } from './model';
import { type OptionView, syncOptionViews } from './option-view';

const selectedText = (model: SelectModel): string => {
	const selected = new Set(model.values);
	return model.options
		.filter((option) => selected.has(option.value))
		.map((option) => option.label)
		.join(', ');
};

const syncAccessibleName = (host: HTMLElement, dom: SelectDom): void => {
	const label = host.getAttribute('label') ?? '';
	const description = host.getAttribute('helper-text') ?? host.getAttribute('description') ?? '';
	dom.label.textContent = label;
	dom.label.hidden = !label;
	dom.description.textContent = description;
	dom.description.hidden = !description;
	dom.trigger.removeAttribute('aria-label');
	dom.trigger.removeAttribute('aria-labelledby');
	dom.trigger.removeAttribute('aria-describedby');

	if (label) {
		dom.trigger.setAttribute('aria-labelledby', dom.label.id);
	} else {
		dom.trigger.setAttribute('aria-label', host.getAttribute('aria-label') ?? 'Select');
	}

	if (description) {
		dom.trigger.setAttribute('aria-describedby', dom.description.id);
	}
};

export const renderSelect = (
	host: HTMLElement,
	dom: SelectDom,
	model: SelectModel,
	views: Map<string, OptionView>,
	open: boolean,
): void => {
	const disabled = host.hasAttribute('disabled');
	const placeholder = host.getAttribute('placeholder') ?? '';
	const text = selectedText(model);
	const size = host.getAttribute('size');
	const status = host.getAttribute('status');
	host.dataset.filled = String(model.values.length > 0);
	host.dataset.labelFloat = String(Boolean(text || placeholder || open));
	host.dataset.open = String(open);

	if (size) {
		host.dataset.size = size;
	} else {
		delete host.dataset.size;
	}

	if (status) {
		host.dataset.status = status;
	} else {
		delete host.dataset.status;
	}

	dom.popup.dataset.open = String(open);
	dom.popup.hidden = !open;
	dom.trigger.disabled = disabled;
	dom.trigger.setAttribute('aria-expanded', String(open));
	dom.trigger.setAttribute('aria-required', String(host.hasAttribute('required')));
	dom.list.setAttribute('aria-multiselectable', String(host.hasAttribute('multiple')));
	dom.value.textContent = text || placeholder;
	dom.value.classList.toggle('alt-select__placeholder', !text);
	syncAccessibleName(host, dom);
	syncOptionViews(dom.list, views, model.options, model.activeValue, model.values);
	const activeView = model.activeValue ? views.get(model.activeValue) : undefined;
	dom.trigger.toggleAttribute('aria-activedescendant', Boolean(open && activeView));

	if (open && activeView) {
		dom.trigger.setAttribute('aria-activedescendant', activeView.element.id);
	}

	configureSelectCarrier(dom.carrier, {
		disabled,
		form: host.getAttribute('form') ?? undefined,
		multiple: host.hasAttribute('multiple'),
		name: host.getAttribute('name') ?? '',
		required: host.hasAttribute('required'),
	});
	setSelectCarrierValues(dom.carrier, model.values);
	syncSelectCustomValidity(host, dom.carrier);

	if (dom.carrier.validity.valid && host.dataset.validationInvalid === 'true') {
		host.removeAttribute('aria-invalid');
		delete host.dataset.validationInvalid;
	}

	const invalid = host.getAttribute('aria-invalid') === 'true' || status === 'error';
	dom.trigger.setAttribute('aria-invalid', String(invalid));
};
