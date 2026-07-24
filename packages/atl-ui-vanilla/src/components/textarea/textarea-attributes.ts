import type { TextareaDom } from './textarea-dom';

const STRING_ATTRIBUTES = ['autocomplete', 'form', 'inputmode', 'name', 'placeholder', 'wrap'] as const;

const BOOLEAN_ATTRIBUTES = ['disabled', 'readonly', 'required'] as const;

export const TEXTAREA_OBSERVED_ATTRIBUTES = [
	...STRING_ATTRIBUTES,
	...BOOLEAN_ATTRIBUTES,
	'aria-invalid',
	'aria-label',
	'description',
	'helper-text',
	'label',
	'max-length',
	'min-length',
	'read-only-styled',
	'rows',
	'show-character-count',
	'size',
	'status',
	'value',
];

const copyStringAttributes = (host: HTMLElement, textarea: HTMLTextAreaElement): void => {
	for (const name of STRING_ATTRIBUTES) {
		const value = host.getAttribute(name);

		if (value === null) {
			textarea.removeAttribute(name);
		} else {
			textarea.setAttribute(name, value);
		}
	}
};

const copyNonNegativeIntegerAttribute = (
	host: HTMLElement,
	textarea: HTMLTextAreaElement,
	hostName: string,
	nativeName: string,
): void => {
	const value = host.getAttribute(hostName);

	const parsed = value === null || value.trim() === '' ? Number.NaN : Number(value);

	if (!Number.isInteger(parsed) || parsed < 0) {
		textarea.removeAttribute(nativeName);

		return;
	}

	textarea.setAttribute(nativeName, String(parsed));
};

const copyPositiveIntegerAttribute = (
	host: HTMLElement,
	textarea: HTMLTextAreaElement,
	hostName: string,
	nativeName: string,
): void => {
	const value = host.getAttribute(hostName);

	const parsed = value === null || value.trim() === '' ? Number.NaN : Number(value);

	if (!Number.isInteger(parsed) || parsed <= 0) {
		textarea.removeAttribute(nativeName);

		return;
	}

	textarea.setAttribute(nativeName, String(parsed));
};

export const syncTextareaAttributes = (host: HTMLElement, dom: TextareaDom): void => {
	copyStringAttributes(host, dom.field);

	for (const name of BOOLEAN_ATTRIBUTES) {
		dom.field.toggleAttribute(name, host.hasAttribute(name));
	}

	copyNonNegativeIntegerAttribute(host, dom.field, 'max-length', 'maxlength');

	copyNonNegativeIntegerAttribute(host, dom.field, 'min-length', 'minlength');

	copyPositiveIntegerAttribute(host, dom.field, 'rows', 'rows');

	const ariaLabel = host.getAttribute('aria-label');

	const label = host.getAttribute('label');

	const describedBy = [
		host.hasAttribute('description') ? dom.description.id : '',
		host.hasAttribute('helper-text') ? dom.helper.id : '',
	].filter(Boolean);

	const invalid = host.dataset.status === 'error' || host.getAttribute('aria-invalid') === 'true';

	dom.field.setAttribute('aria-invalid', String(invalid));

	if (describedBy.length > 0) {
		dom.field.setAttribute('aria-describedby', describedBy.join(' '));
	} else {
		dom.field.removeAttribute('aria-describedby');
	}

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
