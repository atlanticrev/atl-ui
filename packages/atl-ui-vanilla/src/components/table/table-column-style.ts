import type { AltTableColumn } from './types';

const toCssSize = (value: number | string | undefined): string => {
	if (typeof value === 'number') return `${value}px`;

	return value ?? '';
};

export const applyTableColumnStyle = <RecordType extends object>(
	cell: HTMLTableCellElement,
	column: AltTableColumn<RecordType>,
	includeWidth: boolean,
): void => {
	cell.style.textAlign = column.align ?? '';

	cell.style.minWidth = toCssSize(column.minWidth);

	cell.style.width = includeWidth ? toCssSize(column.width) : '';

	if (column.overflow) cell.dataset.overflow = column.overflow;
	else delete cell.dataset.overflow;
};
