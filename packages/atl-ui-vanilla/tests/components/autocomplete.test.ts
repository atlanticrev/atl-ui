import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltAutocompleteElementClass } from '../../src/components/autocomplete';
import type { AltAutocompleteElementApi } from '../../src/components/autocomplete/types';
import { defineAltDropdown } from '../../src/components/dropdown';
import { defineAltInput } from '../../src/components/input';
import { defineAltPopup } from '../../src/components/popup';

const TAG_NAME = 'alt-autocomplete-test';

beforeAll(() => {
	defineAltInput();

	defineAltPopup();

	defineAltDropdown();

	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltAutocompleteElementClass(window.HTMLElement));
	}
});

beforeEach(() => document.body.replaceChildren());

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-autocomplete', () => {
	it('filters options and selects the active result with the keyboard', async () => {
		const autocomplete = document.createElement(TAG_NAME) as AltAutocompleteElementApi;

		const onChange = vi.fn();

		autocomplete.options = [
			{ label: 'Figma', value: 'figma' },
			{ label: 'Linear', value: 'linear' },
			{ label: 'Notion', value: 'notion' },
		];

		autocomplete.addEventListener('alt-change', onChange);

		document.body.append(autocomplete);

		await flushUpdates();

		const popup = autocomplete.querySelector<HTMLElement>('[data-alt-autocomplete-popup]') as HTMLElement;

		expect(autocomplete.querySelector('[data-alt-icon="chevron-down"]')).toBeInstanceOf(SVGSVGElement);

		expect(autocomplete.querySelector('[data-alt-icon="close"]')).toBeInstanceOf(SVGSVGElement);

		expect(autocomplete.querySelector('[data-alt-autocomplete-trigger]')?.classList.contains('alt-button')).toBe(
			true,
		);

		expect(autocomplete.querySelector('[data-alt-autocomplete-clear]')?.classList.contains('alt-button')).toBe(
			true,
		);

		const input = autocomplete.inputElement as HTMLInputElement;

		input.value = 'lin';

		input.dispatchEvent(new Event('input', { bubbles: true }));

		await flushUpdates();

		expect(autocomplete.open).toBe(true);

		expect(popup.querySelectorAll('.alt-listbox__option')).toHaveLength(1);

		input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));

		await flushUpdates();

		expect(autocomplete.value).toBe('linear');

		expect(input.value).toBe('Linear');

		expect(onChange).toHaveBeenCalledOnce();
	});

	it('updates filtering when focus already opened the popup', async () => {
		const autocomplete = document.createElement(TAG_NAME) as AltAutocompleteElementApi;

		autocomplete.options = [
			{ label: 'Figma', value: 'figma' },
			{ label: 'Linear', value: 'linear' },
		];

		document.body.append(autocomplete);

		await flushUpdates();

		const popup = autocomplete.querySelector<HTMLElement>('[data-alt-autocomplete-popup]') as HTMLElement;

		autocomplete.inputElement?.focus();

		await flushUpdates();

		if (autocomplete.inputElement) autocomplete.inputElement.value = 'lin';

		autocomplete.inputElement?.dispatchEvent(new Event('input', { bubbles: true }));

		await flushUpdates();

		expect(popup.querySelectorAll('.alt-listbox__option')).toHaveLength(1);
	});

	it('floats the nested input label when a placeholder is present', async () => {
		const autocomplete = document.createElement(TAG_NAME) as AltAutocompleteElementApi;

		autocomplete.setAttribute('label', 'Tool');

		autocomplete.setAttribute('placeholder', 'Choose a tool');

		document.body.append(autocomplete);

		await flushUpdates();

		const inputHost = autocomplete.querySelector<HTMLElement>('alt-input');

		expect(inputHost?.dataset.filled).toBe('false');

		expect(inputHost?.dataset.labelFloat).toBe('true');

		expect(autocomplete.inputElement?.placeholder).toBe('Choose a tool');
	});

	it('preserves a pre-upgrade options property', async () => {
		const name = 'alt-autocomplete-pre-upgrade-test';

		const element = document.createElement(name) as AltAutocompleteElementApi;

		const clearIcon = document.createElement('span');

		const indicatorIcon = document.createElement('span');

		const noResultsIcon = document.createElement('span');

		element.clearIcon = clearIcon;

		element.indicatorIcon = indicatorIcon;

		element.noResultsIcon = noResultsIcon;

		element.options = [{ label: 'Figma', value: 'figma' }];

		document.body.append(element);

		customElements.define(name, createAltAutocompleteElementClass(window.HTMLElement));

		await flushUpdates();

		expect(element.options).toHaveLength(1);

		expect(element.querySelector('[data-alt-autocomplete-clear]')?.firstChild).toBe(clearIcon);

		expect(element.querySelector('[data-alt-autocomplete-trigger]')?.firstChild).toBe(indicatorIcon);

		expect(element.querySelector('.alt-listbox__empty-icon')?.firstChild).toBe(noResultsIcon);
	});

	it('submits selected values and restores the initial value on form reset', async () => {
		const form = document.createElement('form');

		const autocomplete = document.createElement(TAG_NAME) as AltAutocompleteElementApi;

		autocomplete.setAttribute('name', 'tool');

		autocomplete.options = [
			{ label: 'Figma', value: 'figma' },
			{ label: 'Linear', value: 'linear' },
		];

		autocomplete.value = 'figma';

		form.append(autocomplete);

		document.body.append(form);

		await flushUpdates();

		expect(new FormData(form).get('tool')).toBe('figma');

		autocomplete.value = 'linear';

		await flushUpdates();

		form.reset();

		await flushUpdates();

		expect(autocomplete.value).toBe('figma');
	});
});
