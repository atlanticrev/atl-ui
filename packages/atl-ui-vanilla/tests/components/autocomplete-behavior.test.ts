import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import { defineAltAutocomplete } from '../../src/components/autocomplete';
import type { AltAutocompleteElementApi } from '../../src/components/autocomplete/types';

beforeAll(() => {
	defineAltAutocomplete();
});
afterEach(() => document.body.replaceChildren());

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();
	await Promise.resolve();
	await Promise.resolve();
};

const createAutocomplete = (): AltAutocompleteElementApi => {
	const element = document.createElement('alt-autocomplete') as AltAutocompleteElementApi;
	element.options = [
		{ label: 'Figma', value: 'figma' },
		{ label: 'Linear', value: 'linear' },
	];
	return element;
};

describe('alt-autocomplete behavior', () => {
	it('exposes the combobox relationship and labels an authored native input', async () => {
		const autocomplete = createAutocomplete();
		const input = document.createElement('input');
		input.dataset.altAutocompleteInput = '';
		autocomplete.setAttribute('label', 'Tool');
		autocomplete.append(input);
		document.body.append(autocomplete);
		await flushUpdates();

		expect(input.getAttribute('role')).toBe('combobox');
		expect(input.getAttribute('aria-label')).toBe('Tool');
		expect(input.getAttribute('aria-controls')).not.toBeNull();
		expect(input.getAttribute('aria-expanded')).toBe('false');
	});

	it('submits every multiple value and emits a reason when cleared', async () => {
		const form = document.createElement('form');
		const autocomplete = createAutocomplete();
		const onChange = vi.fn();
		autocomplete.multiple = true;
		autocomplete.setAttribute('name', 'tools');
		autocomplete.values = ['figma', 'linear'];
		autocomplete.addEventListener('alt-change', onChange);
		form.append(autocomplete);
		document.body.append(form);
		await flushUpdates();

		expect(new FormData(form).getAll('tools')).toEqual(['figma', 'linear']);
		autocomplete.clear();
		await flushUpdates();
		expect(new FormData(form).getAll('tools')).toEqual([]);
		expect(onChange.mock.calls[0]?.[0].detail.reason).toBe('clear');
	});

	it('does not commit Enter while an IME composition is active', async () => {
		const autocomplete = createAutocomplete();
		autocomplete.freeSolo = true;
		document.body.append(autocomplete);
		await flushUpdates();
		const input = autocomplete.inputElement as HTMLInputElement;
		input.value = '入力中';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await flushUpdates();
		input.dispatchEvent(new KeyboardEvent('keydown', {
			bubbles: true,
			isComposing: true,
			key: 'Enter',
		}));
		expect(autocomplete.value).toBe('');
	});
});
