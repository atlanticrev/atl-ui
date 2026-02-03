import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { clsx } from '@/lib/clsx';

import type { ButtonVariant } from './types';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	disableMotion?: boolean;
};

export const AtlButton = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = 'primary', className, children, disableMotion, ...props }, ref) => {
		const classes = clsx(
			'atl-button',
			`atl-button--${variant}`,
			disableMotion && 'atl-button--no-motion',
			className,
		);

		return (
			<button
				className={classes}
				ref={ref}
				{...props}
			>
				<span className="atl-button__label">{children}</span>
			</button>
		);
	},
);

AtlButton.displayName = 'AtlButton';
