import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { SpinnerIcon } from '@/icons/spinner-icon';
import { clsx } from '@/lib/clsx';

import type { ButtonIconSize, ButtonSize, ButtonVariant } from './types';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: ReactNode;
	disableMotion?: boolean;
	htmlType?: 'button' | 'submit' | 'reset';
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	iconSize?: ButtonIconSize;
	isDisabled?: boolean;
	loading?: boolean;
	size?: ButtonSize;
	variant?: ButtonVariant;
};

export const AtlButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ children, className, disableMotion, disabled, htmlType, iconLeft, iconRight, iconSize = 24, isDisabled, loading = false, size = 48, type, variant = 'filled', ...props }, ref) => {
		const isIconOnly = !children && Boolean(iconLeft || iconRight);

		return (
			<button
				{...props}
				className={clsx('atl-button', `atl-button--${variant}`, `atl-button--size-${size}`, loading && 'atl-button--loading', isIconOnly && 'atl-button--icon-only', disableMotion && 'atl-button--no-motion', className)}
				disabled={disabled || isDisabled || loading}
				ref={ref}
				type={htmlType ?? type ?? 'button'}
			>
				<span className="atl-button__content">
					{loading ? <SpinnerIcon size={iconSize} /> : iconLeft}
					{children && <span className="atl-button__label">{children}</span>}
					{!loading && iconRight}
				</span>
			</button>
		);
	},
);

AtlButton.displayName = 'AtlButton';
