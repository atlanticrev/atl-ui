import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltSearchElementClass } from '../../src/components/search';
import type { AltSearchElementApi } from '../../src/components/search/types';

const TAG_NAME = 'alt-search-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, createAltSearchElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

describe('alt-search', () => {
	it('participates in forms through its native search input', async () => {
		document.body.innerHTML = `<form><${TAG_NAME} name="query" value="campaign"></${TAG_NAME}></form>`;

		await Promise.resolve();

		const search = document.querySelector(TAG_NAME) as AltSearchElementApi;

		expect(search.querySelector('input')?.type).toBe('search');

		expect(new FormData(document.querySelector('form') as HTMLFormElement).get('query')).toBe('campaign');
	});

	it('emits the package input event and clears accessibly', async () => {
		document.body.innerHTML = `<${TAG_NAME} value="campaign"></${TAG_NAME}>`;

		await Promise.resolve();

		const search = document.querySelector(TAG_NAME) as AltSearchElementApi;

		const input = vi.fn();

		const clear = search.querySelector<HTMLButtonElement>('.alt-search__clear');

		search.addEventListener('alt-input', input);

		expect(search.querySelector('.alt-search__icon')?.getAttribute('data-alt-icon')).toBe('search');

		expect(clear?.querySelector('[data-alt-icon="close"]')).not.toBeNull();

		expect(clear?.classList.contains('alt-button')).toBe(true);

		expect(clear?.dataset.iconOnly).toBe('');

		expect(clear?.getAttribute('aria-label')).toBe('Clear search');

		clear?.click();

		expect(search.value).toBe('');

		expect(input.mock.calls[0][0].detail).toEqual({ value: '' });

		expect(document.activeElement).toBe(search.querySelector('input'));
	});

	it('restores the authored value on form reset', async () => {
		document.body.innerHTML = `<form><${TAG_NAME} name="query" value="initial"></${TAG_NAME}></form>`;

		await Promise.resolve();

		const search = document.querySelector(TAG_NAME) as AltSearchElementApi;

		const field = search.querySelector('input') as HTMLInputElement;

		field.value = 'changed';

		field.dispatchEvent(new Event('input', { bubbles: true }));

		(document.querySelector('form') as HTMLFormElement).reset();

		await Promise.resolve();

		expect(search.value).toBe('initial');
	});
});
