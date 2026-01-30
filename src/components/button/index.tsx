import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { clsx } from '@/lib/clsx';

type ButtonVariant = 'primary' | 'ghost';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant;
	disableMotion?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = 'primary', className, children, disableMotion, ...props }, ref) => {
		const classes = clsx('ui-button', `ui-button--${variant}`, disableMotion && 'ui-button--no-motion', className);

		return (
			<button
				className={classes}
				ref={ref}
				{...props}
			>
				<span className="ui-button__label">{children}</span>
			</button>
		);
	},
);

Button.displayName = 'Button';
