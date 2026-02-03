export type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

export type DropdownMode = 'anchored' | 'modal' | 'auto';

export type DropdownPosition = {
	top: number;
	left: number;
	minWidth: number;
	transformOrigin: string;
	placement: DropdownPlacement;
};
