export type AltProgressSize = 'md' | 'sm';
export type AltProgressStatus = 'aborted' | 'completed' | 'default' | 'failed' | 'running';

export type AltProgressElementApi = HTMLElement & {
	indeterminate: boolean;
	labelContent: Node | null;
	max: number;
	size: AltProgressSize;
	status: AltProgressStatus;
	value: number;
};
