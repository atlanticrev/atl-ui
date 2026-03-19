import type { ReactNode, RefObject } from 'react';

export type ComboboxOption<T = string> = {
	description?: string;
	disabled?: boolean;
	icon?: ReactNode;
	label: string;
	value: T;
};

export type UseDropdownStateResult = {
	close: () => void;
	isOpen: boolean;
	open: () => void;
	toggle: () => void;
};

export type UseKeyboardNavigationParameters<T> = {
	initialHighlightIndex: number;
	inputRef: RefObject<HTMLInputElement | null>;
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	onSelect: (value: T) => void;
	options: ComboboxOption<T>[];
};
