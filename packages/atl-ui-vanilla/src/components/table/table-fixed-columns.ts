import type { AltTableColumn, AltTableColumnFixed } from './types';

const FIXED_OFFSET_PROPERTY = '--alt-table-fixed-offset';

const toPixelWidth = (value: number | string | undefined): number => {
	if (typeof value === 'number') return value;

	const match = value?.match(/^(\d+(?:\.\d+)?)px$/);

	return match ? Number(match[1]) : 0;
};

const getColumnWidth = (header: HTMLTableCellElement | undefined, column: AltTableColumn): number => {
	const renderedWidth = header?.getBoundingClientRect().width ?? 0;

	if (renderedWidth > 0) return renderedWidth;

	return toPixelWidth(column.width) || toPixelWidth(column.minWidth);
};

const getColumnCells = (table: HTMLTableElement, index: number, side: AltTableColumnFixed): HTMLTableCellElement[] =>
	Array.from(table.rows).flatMap((row) => {
		const cell = row.cells.item(index);

		return cell?.dataset.fixed === side ? [cell] : [];
	});

const syncFixedSide = (
	table: HTMLTableElement,
	columns: readonly AltTableColumn[],
	widths: readonly number[],
	side: AltTableColumnFixed,
): void => {
	const indexes = columns.flatMap((column, index) => (column.fixed === side ? [index] : []));

	if (side === 'right') indexes.reverse();

	let offset = 0;

	indexes.forEach((index, fixedIndex) => {
		const cells = getColumnCells(table, index, side);

		cells.forEach((cell) => {
			cell.style.setProperty(FIXED_OFFSET_PROPERTY, `${offset}px`);

			if (fixedIndex === indexes.length - 1) cell.dataset.fixedEdge = 'true';
			else delete cell.dataset.fixedEdge;
		});

		offset += widths[index] ?? 0;
	});
};

export const syncTableFixedColumns = (table: HTMLTableElement, columns: readonly AltTableColumn[]): void => {
	const headers = Array.from(table.tHead?.rows[0]?.cells ?? []);

	const widths = columns.map((column, index) => getColumnWidth(headers[index], column));

	syncFixedSide(table, columns, widths, 'left');

	syncFixedSide(table, columns, widths, 'right');
};
