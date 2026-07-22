import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { defineAltAutocomplete } from '../../src/components/autocomplete';
import type { AltAutocompleteElementApi } from '../../src/components/autocomplete/types';

beforeAll(() => {
	defineAltAutocomplete();
});
beforeEach(() => document.body.replaceChildren());

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-autocomplete icons', () => {
	it('allows every owned icon to be replaced or hidden', async () => {
		const autocomplete = document.createElement('alt-autocomplete') as AltAutocompleteElementApi;

		const clearIcon = document.createElement('span');

		const indicatorIcon = document.createElement('span');

		const noResultsIcon = document.createElement('span');

		autocomplete.clearIcon = clearIcon;

		autocomplete.indicatorIcon = indicatorIcon;

		autocomplete.noResultsIcon = noResultsIcon;

		document.body.append(autocomplete);

		await flushUpdates();

		expect(autocomplete.querySelector('.alt-autocomplete__clear')?.firstChild).toBe(clearIcon);

		expect(autocomplete.querySelector('.alt-autocomplete__trigger')?.firstChild).toBe(indicatorIcon);

		expect(autocomplete.querySelector('.alt-listbox__empty-icon')?.firstChild).toBe(noResultsIcon);

		autocomplete.clearIcon = null;

		autocomplete.indicatorIcon = null;

		autocomplete.noResultsIcon = null;

		await flushUpdates();

		expect(autocomplete.querySelector('.alt-autocomplete__clear')?.childNodes).toHaveLength(0);

		expect(autocomplete.querySelector('.alt-autocomplete__trigger')?.childNodes).toHaveLength(0);

		expect(autocomplete.querySelector('.alt-listbox__empty-icon')?.childNodes).toHaveLength(0);
	});
});
