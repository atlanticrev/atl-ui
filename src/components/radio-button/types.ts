import type { InputHTMLAttributes } from 'react';

import type { ControlSize } from '@/components/checkbox/types';

export type AtlRadioButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
	invalid?: boolean;
	label?: string;
	size?: ControlSize;
	testId?: string;
};
