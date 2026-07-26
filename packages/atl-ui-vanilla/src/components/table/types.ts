export type AltTableCell = Node | number | string | null | undefined;
export type AltTableCellOverflow = 'ellipsis' | 'nowrap' | 'wrap';
export type AltTableColumnFixed = 'left' | 'right';

export type AltTableColumn<RecordType extends object = Record<string, unknown>> = {
	align?: 'center' | 'left' | 'right';
	className?: string;
	dataIndex?: keyof RecordType | number | string;
	fixed?: AltTableColumnFixed;
	key?: number | string;
	minWidth?: number | string;
	overflow?: AltTableCellOverflow;
	render?: (value: unknown, record: RecordType, index: number) => AltTableCell;
	title?: AltTableCell | (() => AltTableCell);
	width?: number | string;
};

export type AltTablePagination = {
	current?: number;
	pageSize?: number;
	total?: number;
};

export type AltTablePageChangeDetail = { page: number; pageSize: number };

export type AltTableRowClickDetail<RecordType extends object = Record<string, unknown>> = {
	index: number;
	key: string;
	record: RecordType;
};

export type AltTableElementApi<RecordType extends object = Record<string, unknown>> = HTMLElement & {
	columns: readonly AltTableColumn<RecordType>[];
	dataSource: readonly RecordType[];
	emptyContent: AltTableCell;
	nextIcon: Node | null;
	pagination: AltTablePagination | false;
	previousIcon: Node | null;
	rowClassName: string | ((record: RecordType, index: number) => string);
	rowKey: string | ((record: RecordType) => string);
};
