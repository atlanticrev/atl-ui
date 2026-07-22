export type PaginationItem = number | 'ellipsis-end' | 'ellipsis-start';

export const pageCount = (total: number, pageSize: number): number => {
	return Math.max(1, Math.ceil(Math.max(0, total) / Math.max(1, pageSize)));
};

export const paginationRange = (current: number, count: number, siblings = 1): PaginationItem[] => {
	if (count <= 7 + siblings * 2) return Array.from({ length: count }, (_, index) => index + 1);

	const left = Math.max(2, current - siblings);

	const right = Math.min(count - 1, current + siblings);

	const result: PaginationItem[] = [1];

	if (left > 2) result.push('ellipsis-start');

	for (let page = left; page <= right; page += 1) result.push(page);

	if (right < count - 1) result.push('ellipsis-end');

	result.push(count);

	return result;
};
