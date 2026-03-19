import type { ReactNode } from 'react';

export type DropdownItem<T = string> = {
	description?: string;
	disabled?: boolean;
	icon?: ReactNode;
	label: string;
	value: T;
};

export type AtlDropdownProps<T = string> = {
	className?: string;
	emptyState?: ReactNode;
	footerText?: string;
	headerSlot?: ReactNode;
	highlightedIndex?: number;
	id?: string;
	items: DropdownItem<T>[];
	maxHeight?: number;
	multiSelect?: boolean;
	onSelect?: (value: T) => void;
	onSelectAll?: () => void;
	optionIdPrefix?: string;
	selectAllText?: string;
	selectedValues?: T[];
	showFooter?: boolean;
	testId: string;
};
