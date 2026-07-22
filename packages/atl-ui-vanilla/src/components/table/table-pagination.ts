import type { AltTablePagination } from './types';

const DEFAULT_PAGE_SIZE = 10;

export type TablePage = {
	current: number;
	pageSize: number;
	totalPages: number;
};

export const resolveTablePage = (
	dataLength: number,
	pagination: AltTablePagination | false,
	internalPage: number,
): TablePage => {
	const config = pagination || undefined;

	const pageSize = config?.pageSize ? Math.max(1, config.pageSize) : DEFAULT_PAGE_SIZE;

	const total = config?.total ?? dataLength;

	const totalPages = Math.max(1, Math.ceil(Math.max(0, total) / pageSize));

	const requested = config?.current ?? internalPage;

	return { current: Math.min(Math.max(1, requested), totalPages), pageSize, totalPages };
};

export const sliceTablePage = <RecordType>(
	records: readonly RecordType[],
	pagination: AltTablePagination | false,
	page: TablePage,
): readonly RecordType[] => {
	if (!pagination) return records;

	const start = (page.current - 1) * page.pageSize;

	return records.slice(start, start + page.pageSize);
};
