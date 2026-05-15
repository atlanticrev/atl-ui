import { Fragment, type JSX } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlSkeletonRepeatProps } from './types';

export const AtlSkeletonRepeat = ({
	children,
	className,
	count,
	gap = 12,
	testId,
}: AtlSkeletonRepeatProps): JSX.Element => {
	const items = Array.from({ length: count }, (_, index) => index);

	return (
		<div
			className={clsx('atl-skeleton-repeat', className)}
			data-testid={testId}
			style={{ gap }}
		>
			{items.map((index) => (
				<Fragment key={index}>{children}</Fragment>
			))}
		</div>
	);
};
