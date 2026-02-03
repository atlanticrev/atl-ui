import type { InputHTMLAttributes, ReactNode } from 'react';

export type AtlInputSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export type AtlInputStatus = 'default' | 'error' | 'success';

export type AtlInputVariant = 'text' | 'number';

export type AtlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> & {
  testId?: string;
  value?: string;
  label?: string;
  helperText?: string;
  size?: AtlInputSize;
  status?: AtlInputStatus;
  variant?: AtlInputVariant;
  maxLength?: number;
  showCharacterCount?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  iconRightRotated?: boolean;
  onIconRightClick?: () => void;
  onChange?: (value: string) => void;
};
