export type SwitcherSize = 'L' | 'M';

export type AtlSwitcherProps = {
	checked?: boolean;
	className?: string;
	disabled?: boolean;
	onChange?: (checked: boolean) => void;
	size?: SwitcherSize;
	testId: string;
};
