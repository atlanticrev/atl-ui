import type { AltTableColumn } from './types';

const DEFAULT_COLUMN_WIDTH = 'var(--alt-table-default-column-width, 136px)';

export const toTableCssSize = (value: number | string | undefined): string => {
	if (typeof value === 'number') return `${value}px`;

	return value ?? '';
};

export const resolveTableColumnWidth = <RecordType extends object>(column: AltTableColumn<RecordType>): string => {
	return toTableCssSize(column.width ?? column.minWidth);
};

const resolveTableColumnMinimum = <RecordType extends object>(column: AltTableColumn<RecordType>): string => {
	const minimum = toTableCssSize(column.minWidth);

	const width = toTableCssSize(column.width);

	if (minimum && width) return minimum === width ? minimum : `max(${minimum}, ${width})`;

	return minimum || width || DEFAULT_COLUMN_WIDTH;
};

export const resolveTableMinimumWidth = <RecordType extends object>(
	columns: readonly AltTableColumn<RecordType>[],
): string => {
	if (columns.length === 0) return '100%';

	return `calc(${columns.map(resolveTableColumnMinimum).join(' + ')})`;
};
