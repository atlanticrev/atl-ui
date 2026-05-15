import type { ReactNode } from 'react';

import { clsx } from '@/lib/clsx';

import { renderSkeletonShape } from './render-shape';
import { AtlSkeletonRepeat } from './repeat';
import type { AtlSkeletonProps, AtlSkeletonVariant } from './types';

type AtlSkeletonComponentType = ((props: AtlSkeletonProps) => ReactNode) & {
	Repeat: typeof AtlSkeletonRepeat;
};

const getResolvedVariant = (
	variant: AtlSkeletonVariant | undefined,
	hasChildren: boolean,
): AtlSkeletonVariant => {
	if (variant) {
		return variant;
	}

	return hasChildren ? 'overlay' : 'rect';
};

const AtlSkeletonComponent = ({
	borderRadius,
	children,
	className,
	height,
	loading = true,
	size,
	testId,
	variant,
	width,
}: AtlSkeletonProps): ReactNode => {
	const hasChildren = children !== undefined && children !== null;
	const resolvedVariant = getResolvedVariant(variant, hasChildren);
	const shouldUseOverlay = loading && hasChildren && resolvedVariant === 'overlay';

	if (!loading) {
		return hasChildren ? children : null;
	}

	if (!shouldUseOverlay && resolvedVariant !== 'overlay') {
		return renderSkeletonShape({
			borderRadius,
			className,
			height,
			size,
			testId,
			variant: resolvedVariant,
			width,
		});
	}

	if (!hasChildren) {
		return renderSkeletonShape({
			borderRadius,
			className,
			height,
			size,
			testId,
			variant: 'rect',
			width,
		});
	}

	return (
		<div
			className={clsx('atl-skeleton-wrapper', className)}
			data-testid={testId}
		>
			<div aria-hidden="true" className="atl-skeleton-wrapper__placeholder">
				{children}
			</div>

			<span aria-hidden="true" className="atl-skeleton atl-skeleton--overlay" />
		</div>
	);
};

export const AtlSkeleton = AtlSkeletonComponent as AtlSkeletonComponentType;

AtlSkeleton.Repeat = AtlSkeletonRepeat;
