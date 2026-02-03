import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { clsx } from '@/lib/clsx';

type CardProps<T extends ElementType> = {
	as?: T;
	className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function AtlCard<T extends ElementType = 'div'>({ as, className, ...props }: CardProps<T>) {
	const Component = as ?? 'div';
	const classes = clsx('atl-card', className);

	return (
		<Component
			className={classes}
			{...props}
		/>
	);
}
