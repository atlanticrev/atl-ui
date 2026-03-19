export type ChipSize = 'M' | 'S';
export type ChipVariant = 'default' | 'frozen' | 'danger';

export type CustomChipColors = {
	background: string;
	text: string;
};

export type AtlChipProps = {
	customColors?: CustomChipColors;
	disabled?: boolean;
	label: string;
	onRemove?: () => void;
	size?: ChipSize;
	testId: string;
	variant?: ChipVariant;
	withCross?: boolean;
};
