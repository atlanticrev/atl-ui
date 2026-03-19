import type { InputHTMLAttributes, ReactNode, RefObject } from 'react';

export type AtlInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';
export type AtlInputStatus = 'default' | 'error' | 'success';
export type AtlInputVariant = 'text' | 'number';

export type AtlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> & {
	className?: string;
	description?: string;
	helperText?: string;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	iconRightRotated?: boolean;
	iconRightTooltip?: ReactNode;
	iconRightTooltipOpen?: boolean;
	label?: string;
	maxLength?: number;
	onChange?: (value: string) => void;
	onIconRightClick?: () => void;
	readOnlyStyled?: boolean;
	rootRef?: RefObject<HTMLLabelElement | null>;
	showCharacterCount?: boolean;
	size?: AtlInputSize;
	status?: AtlInputStatus;
	testId?: string;
	value?: string;
	variant?: AtlInputVariant;
};
