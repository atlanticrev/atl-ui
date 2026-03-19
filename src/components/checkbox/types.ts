export type CheckboxSize = 'L' | 'M' | 'S';

export type AtlCheckboxProps = {
	checked?: boolean;
	className?: string;
	disabled?: boolean;
	indeterminate?: boolean;
	label?: string;
	loading?: boolean;
	onChange?: (checked: boolean) => void;
	onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
	size?: CheckboxSize;
	testId: string;
};
