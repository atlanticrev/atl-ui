import { replaceTableContent, resolveCellValue, resolveColumnKey } from './table-content';
import { applyTableColumnStyle } from './table-column-style';
import type { AltTableColumn } from './types';

export type TableRowView = { cells: Map<string, HTMLTableCellElement>; element: HTMLTableRowElement };

export type TableRowOptions<RecordType extends object> = {
	columns: readonly AltTableColumn<RecordType>[];
	getClassName: (record: RecordType, index: number) => string;
	getKey: (record: RecordType, index: number) => string;
	records: readonly RecordType[];
};

export const syncTableRows = <RecordType extends object>(
	tbody: HTMLTableSectionElement,
	views: Map<string, TableRowView>,
	options: TableRowOptions<RecordType>,
): Map<string, { index: number; record: RecordType }> => {
	const active = new Set<string>();

	const rendered = new Map<string, { index: number; record: RecordType }>();

	options.records.forEach((record, index) => {
		const baseKey = options.getKey(record, index);

		const key = active.has(baseKey) ? `${baseKey}:${index}` : baseKey;

		active.add(key);

		const view = views.get(key) ?? createRowView(tbody.ownerDocument);

		views.set(key, view);

		view.element.dataset.key = key;

		view.element.className = options.getClassName(record, index);

		syncCells(view, options.columns, record, index);

		tbody.append(view.element);

		rendered.set(key, { index, record });
	});

	for (const [key, view] of views) {
		if (active.has(key)) continue;

		view.element.remove();

		views.delete(key);
	}

	return rendered;
};

const createRowView = (document: Document): TableRowView => ({
	cells: new Map(),
	element: document.createElement('tr'),
});

const syncCells = <RecordType extends object>(
	view: TableRowView,
	columns: readonly AltTableColumn<RecordType>[],
	record: RecordType,
	rowIndex: number,
): void => {
	const active = new Set<string>();

	columns.forEach((column, index) => {
		const key = resolveColumnKey(column, index);

		active.add(key);

		const cell = view.cells.get(key) ?? view.element.ownerDocument.createElement('td');

		view.cells.set(key, cell);

		cell.className = column.className ?? '';

		applyTableColumnStyle(cell, column, false);

		const value = resolveCellValue(record, column.dataIndex);

		replaceTableContent(cell, column.render ? column.render(value, record, rowIndex) : String(value ?? ''));

		view.element.append(cell);
	});

	for (const [key, cell] of view.cells) {
		if (active.has(key)) continue;

		cell.remove();

		view.cells.delete(key);
	}
};
