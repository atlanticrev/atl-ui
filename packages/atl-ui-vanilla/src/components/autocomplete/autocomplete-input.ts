import type { AltInputElementApi } from '../input';

export type AutocompleteInput = HTMLInputElement | AltInputElementApi;

const isNativeInput = (input: AutocompleteInput): input is HTMLInputElement => input.localName === 'input';

export const getNativeInput = (input: AutocompleteInput): HTMLInputElement | null => {
	return isNativeInput(input) ? input : input.inputElement;
};

export const getInputValue = (input: AutocompleteInput): string => {
	return isNativeInput(input) ? input.value : input.value;
};

export const setInputValue = (input: AutocompleteInput, value: string): void => {
	input.value = value;
};

export const syncInputHostAttributes = (host: HTMLElement, input: AutocompleteInput): void => {
	const attributes = [
		'disabled',
		'helper-text',
		'label',
		'placeholder',
		'readonly',
		'size',
		'status',
	] as const;

	for (const name of attributes) {
		const value = host.getAttribute(name);
		if (value === null) input.removeAttribute(name);
		else input.setAttribute(name, value);
	}

	if (isNativeInput(input)) {
		input.disabled = host.hasAttribute('disabled');
		input.placeholder = host.getAttribute('placeholder') ?? '';
		input.readOnly = host.hasAttribute('readonly');
		const ariaLabel = host.getAttribute('aria-label');
		const label = host.getAttribute('label');
		if (ariaLabel !== null) input.setAttribute('aria-label', ariaLabel);
		else if (label && !input.hasAttribute('aria-labelledby')) input.setAttribute('aria-label', label);
	}
};
