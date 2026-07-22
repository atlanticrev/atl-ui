import type { InputDom } from './input-dom';

const STRING_ATTRIBUTES = [
	'autocomplete',
	'form',
	'inputmode',
	'max',
	'min',
	'name',
	'pattern',
	'placeholder',
	'step',
	'type',
] as const;

const BOOLEAN_ATTRIBUTES = ['disabled', 'readonly', 'required'] as const;

export const INPUT_OBSERVED_ATTRIBUTES = [
	...STRING_ATTRIBUTES,
	...BOOLEAN_ATTRIBUTES,
	'aria-label',
	'description',
	'helper-text',
	'label',
	'max-length',
	'read-only-styled',
	'show-character-count',
	'size',
	'status',
	'value',
	'variant',
];

const copyStringAttributes = (host: HTMLElement, input: HTMLInputElement): void => {
	for (const name of STRING_ATTRIBUTES) {
		const value = host.getAttribute(name);

		if (value === null) {
			input.removeAttribute(name);
		} else {
			input.setAttribute(name, value);
		}
	}
};

export const syncInputAttributes = (host: HTMLElement, dom: InputDom): void => {
	copyStringAttributes(host, dom.field);

	for (const name of BOOLEAN_ATTRIBUTES) {
		dom.field.toggleAttribute(name, host.hasAttribute(name));
	}

	const ariaLabel = host.getAttribute('aria-label');

	const label = host.getAttribute('label');

	const variant = host.getAttribute('variant') ?? 'text';

	const requestedMaxLength = Number(host.getAttribute('max-length') ?? 300);

	const maxLength = Number.isFinite(requestedMaxLength) ? Math.max(0, requestedMaxLength) : 300;

	const describedBy = [
		host.hasAttribute('description') ? dom.description.id : '',
		host.hasAttribute('helper-text') ? dom.helper.id : '',
	].filter(Boolean);

	dom.field.maxLength = maxLength;

	dom.field.classList.toggle('alt-input__field--number', variant === 'number');

	if (variant === 'number' && !host.hasAttribute('inputmode')) {
		dom.field.inputMode = 'decimal';
	}

	dom.field.setAttribute('aria-invalid', String(host.dataset.status === 'error'));

	dom.field.setAttribute('aria-describedby', describedBy.join(' '));

	if (ariaLabel !== null) {
		dom.field.setAttribute('aria-label', ariaLabel);

		dom.field.removeAttribute('aria-labelledby');
	} else if (label) {
		dom.field.removeAttribute('aria-label');

		dom.field.setAttribute('aria-labelledby', dom.label.id);
	} else {
		dom.field.removeAttribute('aria-label');

		dom.field.removeAttribute('aria-labelledby');
	}
};
