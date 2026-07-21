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

describe('alt-autocomplete composition', () => {
	it('keeps authored input and trigger, then closes on a repeated trigger click', async () => {
		const autocomplete = createAutocomplete();
		const input = document.createElement('input');
		const trigger = document.createElement('button');
		input.dataset.altAutocompleteInput = '';
		trigger.dataset.altAutocompleteTrigger = '';
		trigger.textContent = 'Browse tools';
		autocomplete.append(input, trigger);
		document.body.append(autocomplete);
		await flushUpdates();

		trigger.click();
		expect(autocomplete.open).toBe(true);
		trigger.dispatchEvent(new MouseEvent('pointerdown', {
			bubbles: true,
			cancelable: true,
			composed: true,
		}));
		trigger.click();
		expect(autocomplete.open).toBe(false);
		expect(autocomplete.inputElement).toBe(input);
		expect(autocomplete.triggerElement).toBe(trigger);
		expect(trigger.textContent).toBe('Browse tools');
	});

	it('emits one reasoned event per open transition', async () => {
		const autocomplete = createAutocomplete();
		const onOpen = vi.fn();
		autocomplete.addEventListener('alt-open-change', onOpen);
		document.body.append(autocomplete);
		await flushUpdates();

		autocomplete.triggerElement?.click();
		await flushUpdates();
		expect(onOpen).toHaveBeenCalledOnce();
		expect(onOpen.mock.calls[0]?.[0].detail.reason).toBe('trigger');
	});

	it('preserves declarative options across reconnects', async () => {
		const autocomplete = document.createElement('alt-autocomplete') as AltAutocompleteElementApi;
		const option = document.createElement('alt-option');
		option.setAttribute('label', 'Figma');
		option.setAttribute('value', 'figma');
		autocomplete.append(option);
		document.body.append(autocomplete);
		await flushUpdates();

		autocomplete.remove();
		document.body.append(autocomplete);
		await flushUpdates();
		expect(autocomplete.options).toHaveLength(1);
		expect(autocomplete.querySelector('alt-option')).toBe(option);
	});

	it('allows consumers to cancel opening before DOM state changes', async () => {
		const autocomplete = createAutocomplete();
		autocomplete.addEventListener('alt-before-open-change', (event) => event.preventDefault());
		document.body.append(autocomplete);
		await flushUpdates();

		autocomplete.triggerElement?.click();
		expect(autocomplete.open).toBe(false);
	});

	it('supports multiple selection without closing and free-solo creation', async () => {
		const autocomplete = createAutocomplete();
		autocomplete.multiple = true;
		document.body.append(autocomplete);
		await flushUpdates();
		autocomplete.triggerElement?.click();
		await flushUpdates();
		autocomplete.querySelector<HTMLElement>('[data-value="figma"]')?.click();
		await flushUpdates();
		expect(autocomplete.values).toEqual(['figma']);
		expect(autocomplete.open).toBe(true);

		autocomplete.multiple = false;
		autocomplete.freeSolo = true;
		const input = autocomplete.inputElement as HTMLInputElement;
		input.value = 'Custom tool';
		input.dispatchEvent(new Event('input', { bubbles: true }));
		await flushUpdates();
		input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
		await flushUpdates();
		expect(autocomplete.value).toBe('Custom tool');
	});
});
