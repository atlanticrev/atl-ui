export type AltTabsChangeDetail = {
	activeKey: string;
	previousKey: string | null;
};

export type AltTabsElementApi = HTMLElement & {
	activeKey: string | null;
};
