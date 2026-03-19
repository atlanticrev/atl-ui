import type { InputHTMLAttributes } from 'react';

export type RadioButtonSize = 16 | 24;

export type AtlRadioButtonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> & {
	invalid?: boolean;
	label?: string;
	size?: RadioButtonSize;
	testId: string;
};
