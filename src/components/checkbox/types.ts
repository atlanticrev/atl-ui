import type { MouseEvent } from 'react';

export type ControlSize = 's' | 'm' | 'l';

export type AtlCheckboxProps = {
	ariaLabel?: string;
	checked?: boolean;
	className?: string;
	disabled?: boolean;
	indeterminate?: boolean;
	invalid?: boolean;
	label?: string;
	loading?: boolean;
	onChange?: (checked: boolean) => void;
	onClick?: (event: MouseEvent<HTMLInputElement>) => void;
	size?: ControlSize;
	testId?: string;
};
