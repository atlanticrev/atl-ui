import type { InputHTMLAttributes, ReactNode } from 'react';

export type UiInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export type UiInputStatus = 'default' | 'error' | 'success';

export type UiInputVariant = 'text' | 'number';

export type UiInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> & {
  testId?: string;
  value?: string;
  label?: string;
  helperText?: string;
  size?: UiInputSize;
  status?: UiInputStatus;
  variant?: UiInputVariant;
  maxLength?: number;
  showCharacterCount?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconRightRotated?: boolean;
  onIconRightClick?: () => void;
  onChange?: (value: string) => void;
};
