import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltPaginationElementClass, pageCount, paginationRange } from '../../src/components/pagination';
import type { AltPaginationElementApi } from '../../src/components/pagination/types';

const TAG_NAME = 'alt-pagination-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME))
		customElements.define(TAG_NAME, createAltPaginationElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

describe('pagination', () => {
	it('calculates compact ranges', () => {
		expect(pageCount(101, 10)).toBe(11);

		expect(paginationRange(6, 12)).toEqual([1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 12]);
	});

	it('renders native controls and emits page changes', async () => {
		document.body.innerHTML = `<${TAG_NAME} page="2" page-size="10" total="120"></${TAG_NAME}>`;

		await Promise.resolve();

		const pagination = document.querySelector(TAG_NAME) as AltPaginationElementApi;

		const changed = vi.fn();

		pagination.addEventListener('alt-change', changed);

		pagination.querySelector<HTMLButtonElement>('[data-page="3"]')?.click();

		expect(pagination.page).toBe(3);

		expect(changed.mock.calls[0][0].detail).toEqual({ page: 3, pageSize: 10 });
	});

	it('supports optional page-size choices', async () => {
		document.body.innerHTML = `<${TAG_NAME} page="4" page-size="10" total="120"></${TAG_NAME}>`;

		await Promise.resolve();

		const pagination = document.querySelector(TAG_NAME) as AltPaginationElementApi;

		pagination.pageSizeOptions = [10, 20, 50];

		await Promise.resolve();

		const select = pagination.querySelector('select') as HTMLSelectElement;

		select.value = '20';

		select.dispatchEvent(new Event('change', { bubbles: true }));

		expect(pagination.page).toBe(1);

		expect(pagination.pageSize).toBe(20);
	});
});
