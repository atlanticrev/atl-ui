export type AltPaginationChangeDetail = {
	page: number;
	pageSize: number;
};

export type AltPaginationElementApi = HTMLElement & {
	page: number;
	pageSize: number;
	pageSizeOptions: readonly number[];
	total: number;
};
