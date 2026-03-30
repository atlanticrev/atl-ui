import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

import { SpinnerIcon } from '@/icons/spinner-icon';
import { clsx } from '@/lib/clsx';

import type { ButtonIconSize, ButtonSize, ButtonVariant } from './types';

type AtlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	children?: ReactNode;
	disableMotion?: boolean;
	iconLeft?: ReactNode;
	iconRight?: ReactNode;
	iconSize?: ButtonIconSize;
	loading?: boolean;
	size?: ButtonSize;
	variant?: ButtonVariant;
};

export const AtlButton = forwardRef<HTMLButtonElement, AtlButtonProps>(
	({ children, className, disableMotion, disabled, iconLeft, iconRight, iconSize = 24, loading = false, size = 48, type = 'button', variant = 'filled', ...props }, ref) => {
		const isIconOnly = !children && Boolean(iconLeft || iconRight);

		return (
			<button
				{...props}
				className={clsx('atl-button', `atl-button--${variant}`, `atl-button--size-${size}`, loading && 'atl-button--loading', isIconOnly && 'atl-button--icon-only', disableMotion && 'atl-button--no-motion', className)}
				disabled={disabled || loading}
				ref={ref}
				type={type}
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
