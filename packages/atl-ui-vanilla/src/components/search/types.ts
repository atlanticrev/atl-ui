export type AltSearchChangeDetail = { value: string };

export type AltSearchElementApi = HTMLElement & {
	focus: (options?: FocusOptions) => void;
	value: string;
};
