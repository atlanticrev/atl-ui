import { resolveTableColumnWidth, toTableCssSize } from './table-column-size';
import type { AltTableColumn } from './types';

export const applyTableColumnStyle = <RecordType extends object>(
	cell: HTMLTableCellElement,
	column: AltTableColumn<RecordType>,
	includeWidth: boolean,
): void => {
	cell.style.textAlign = column.align ?? '';

	cell.style.minWidth = toTableCssSize(column.minWidth);

	cell.style.width = includeWidth ? resolveTableColumnWidth(column) : '';

	if (column.overflow) cell.dataset.overflow = column.overflow;
	else delete cell.dataset.overflow;

	if (column.fixed) cell.dataset.fixed = column.fixed;
	else {
		delete cell.dataset.fixed;

		delete cell.dataset.fixedEdge;

		cell.style.removeProperty('--alt-table-fixed-offset');
	}
};
