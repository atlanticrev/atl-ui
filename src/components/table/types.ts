import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react';

export type SimpleTableColumn<RecordType> = {
	align?: 'left' | 'center' | 'right';
	className?: string;
	dataIndex?: string | number;
	key?: Key;
	render?: (value: unknown, record: RecordType, index: number) => ReactNode;
	title?: ReactNode | ((properties: Record<string, unknown>) => ReactNode);
	width?: string | number;
};

export type SimpleTablePaginationConfig = {
	current?: number;
	onChange?: (page: number, pageSize: number) => void;
	pageSize?: number;
	total?: number;
};

export type SimpleTableLocale = {
	emptyText?: ReactNode;
};

export type AtlSimpleTableProps<RecordType extends object = object> = {
	ariaLabel?: string;
	className?: string;
	columns?: SimpleTableColumn<RecordType>[];
	dataSource?: RecordType[] | null;
	locale?: SimpleTableLocale;
	onRow?: (record: RecordType, index?: number) => HTMLAttributes<HTMLTableRowElement>;
	pagination?: SimpleTablePaginationConfig | false;
	rowClassName?: string | ((record: RecordType, index: number) => string);
	rowKey?: string | ((record: RecordType) => string);
	style?: CSSProperties;
};
