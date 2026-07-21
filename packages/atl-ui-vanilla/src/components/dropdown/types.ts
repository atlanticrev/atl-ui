import type { AltSelectOption } from '../select/types';

export type AltDropdownOption = AltSelectOption;

export type AltDropdownChangeDetail = {
	value: string;
	values: readonly string[];
};

export type AltDropdownElementApi = HTMLElement & {
	activeValue: string;
	emptyIcon: Node | null;
	emptyText: string;
	footerText: string;
	moveActive: (direction: 1 | -1, edge?: 'end' | 'start') => void;
	multiple: boolean;
	options: readonly AltDropdownOption[];
	select: (value: string) => boolean;
	selectAll: () => boolean;
	value: string;
	values: readonly string[];
};
