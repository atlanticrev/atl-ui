export type AltCollapseChangeDetail = {
	openKeys: readonly string[];
};

export type AltCollapseElementApi = HTMLElement & {
	openKeys: readonly string[];
	single: boolean;
};
