import type { CSSProperties, HTMLAttributes, Key, ReactNode } from 'react';

export type TableColumn<RecordType> = {
	align?: 'left' | 'center' | 'right';
	className?: string;
	dataIndex?: string | number;
	key?: Key;
	render?: (value: unknown, record: RecordType, index: number) => ReactNode;
	title?: ReactNode | ((properties: Record<string, unknown>) => ReactNode);
	width?: string | number;
};

export type TablePaginationConfig = {
	current?: number;
	onChange?: (page: number, pageSize: number) => void;
	pageSize?: number;
	total?: number;
};

export type TableLocale = {
	emptyText?: ReactNode;
};

export type AtlTableProps<RecordType extends object = object> = {
	ariaLabel?: string;
	className?: string;
	columns?: TableColumn<RecordType>[];
	dataSource?: RecordType[] | null;
	locale?: TableLocale;
	onRow?: (record: RecordType, index?: number) => HTMLAttributes<HTMLTableRowElement>;
	pagination?: TablePaginationConfig | false;
	rowClassName?: string | ((record: RecordType, index: number) => string);
	rowKey?: string | ((record: RecordType) => string);
	style?: CSSProperties;
};
