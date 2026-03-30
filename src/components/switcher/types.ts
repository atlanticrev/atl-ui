import type { ControlSize } from '@/components/checkbox/types';

export type AtlSwitcherProps = {
	checked?: boolean;
	className?: string;
	disabled?: boolean;
	invalid?: boolean;
	onChange?: (checked: boolean) => void;
	size?: Extract<ControlSize, 'm' | 'l'>;
	testId?: string;
};
