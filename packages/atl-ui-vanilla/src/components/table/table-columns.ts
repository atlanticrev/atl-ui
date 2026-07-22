import { replaceTableContent, resolveColumnKey } from './table-content';
import { applyTableColumnStyle } from './table-column-style';
import type { AltTableColumn } from './types';

export const syncTableColumns = (
	thead: HTMLTableSectionElement,
	columns: readonly AltTableColumn[],
	views: Map<string, HTMLTableCellElement>,
): void => {
	const document = thead.ownerDocument;

	const row = thead.rows[0] ?? thead.insertRow();

	const active = new Set<string>();

	columns.forEach((column, index) => {
		const key = resolveColumnKey(column, index);

		active.add(key);

		const cell = views.get(key) ?? document.createElement('th');

		views.set(key, cell);

		cell.dataset.key = key;

		applyTableColumnStyle(cell, column, true);

		replaceTableContent(cell, typeof column.title === 'function' ? column.title() : column.title);

		row.append(cell);
	});

	for (const [key, cell] of views) {
		if (active.has(key)) continue;

		cell.remove();

		views.delete(key);
	}
};
