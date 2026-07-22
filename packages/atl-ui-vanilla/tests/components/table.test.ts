import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltTableElementClass } from '../../src/components/table';
import type { AltTableElementApi } from '../../src/components/table/types';

const TAG_NAME = 'alt-table-test';
type Row = Record<string, unknown> & { id: string; name: string };

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, createAltTableElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();

	await Promise.resolve();
};

describe('alt-table', () => {
	it('reuses keyed rows when data changes order', async () => {
		const table = document.createElement(TAG_NAME) as AltTableElementApi<Row>;

		table.columns = [{ dataIndex: 'name', title: 'Name' }];

		table.rowKey = 'id';

		table.dataSource = [
			{ id: 'one', name: 'One' },
			{ id: 'two', name: 'Two' },
		];

		document.body.append(table);

		await flushUpdates();

		const firstRow = table.querySelector<HTMLTableRowElement>('tr[data-key="one"]');

		table.dataSource = [
			{ id: 'two', name: 'Two' },
			{ id: 'one', name: 'One updated' },
		];

		await flushUpdates();

		expect(table.querySelector('tr[data-key="one"]')).toBe(firstRow);

		expect(firstRow?.textContent).toBe('One updated');
	});

	it('paginates locally and emits page changes', async () => {
		const table = document.createElement(TAG_NAME) as AltTableElementApi<Row>;

		const onPageChange = vi.fn();

		const nextIcon = document.createElement('span');

		const previousIcon = document.createElement('span');

		table.columns = [{ dataIndex: 'name', title: 'Name' }];

		table.dataSource = [
			{ id: 'one', name: 'One' },
			{ id: 'two', name: 'Two' },
		];

		table.pagination = { pageSize: 1 };

		table.nextIcon = nextIcon;

		table.previousIcon = previousIcon;

		table.addEventListener('alt-page-change', onPageChange);

		document.body.append(table);

		await flushUpdates();

		expect(table.querySelector('tbody')?.textContent).toBe('One');

		expect(table.querySelector('.alt-button__icon--end')?.firstChild).toBe(nextIcon);

		expect(table.querySelector('.alt-button__icon--start')?.firstChild).toBe(previousIcon);

		table.querySelector<HTMLButtonElement>('.alt-simple-table__pagination button:last-child')?.click();

		await flushUpdates();

		expect(table.querySelector('tbody')?.textContent).toBe('Two');

		expect(onPageChange).toHaveBeenCalledOnce();
	});

	it('makes the horizontal scroll region keyboard accessible', async () => {
		const table = document.createElement(TAG_NAME) as AltTableElementApi<Row>;

		table.setAttribute('aria-label', 'Channels');

		table.columns = [{ dataIndex: 'name', title: 'Name' }];

		document.body.append(table);

		await flushUpdates();

		const scroll = table.querySelector('.alt-simple-table__scroll');

		expect(scroll?.getAttribute('role')).toBe('region');

		expect(scroll?.getAttribute('tabindex')).toBe('0');

		expect(scroll?.getAttribute('aria-label')).toBe('Channels scroll area');
	});

	it('applies column sizing and overflow contracts to headers and cells', async () => {
		const table = document.createElement(TAG_NAME) as AltTableElementApi<Row>;

		table.columns = [
			{
				dataIndex: 'name',
				minWidth: 180,
				overflow: 'ellipsis',
				title: 'Name',
				width: '60%',
			},
		];

		table.dataSource = [{ id: 'one', name: 'A long channel name' }];

		document.body.append(table);

		await flushUpdates();

		const header = table.querySelector<HTMLTableCellElement>('th');

		const cell = table.querySelector<HTMLTableCellElement>('td');

		expect(header?.style.minWidth).toBe('180px');

		expect(header?.style.width).toBe('60%');

		expect(header?.dataset.overflow).toBe('ellipsis');

		expect(cell?.style.minWidth).toBe('180px');

		expect(cell?.dataset.overflow).toBe('ellipsis');
	});
});
