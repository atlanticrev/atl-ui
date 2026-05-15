import type { CSSProperties, JSX } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlSkeletonProps, AtlSkeletonShapeVariant } from './types';

type ShapeStyleParams = Pick<
	AtlSkeletonProps,
	'borderRadius' | 'height' | 'size' | 'width'
> & {
	variant: AtlSkeletonShapeVariant;
};

const DEFAULT_LINE_HEIGHT = '1em';
const DEFAULT_RECT_HEIGHT = '1rem';
const DEFAULT_CIRCLE_SIZE = 40;

const getShapeStyle = ({
	borderRadius,
	height,
	size,
	variant,
	width,
}: ShapeStyleParams): CSSProperties => {
	if (variant === 'circle') {
		const circleSize = size ?? width ?? DEFAULT_CIRCLE_SIZE;

		return {
			borderRadius: '50%',
			height: circleSize,
			width: circleSize,
		};
	}

	const resolvedHeight = height ?? (variant === 'line' ? DEFAULT_LINE_HEIGHT : DEFAULT_RECT_HEIGHT);
	const resolvedWidth = width ?? '100%';
	const resolvedRadius =
		borderRadius ?? (variant === 'line' ? '999px' : 'var(--atl-radius-sm)');

	return {
		borderRadius: resolvedRadius,
		height: resolvedHeight,
		width: resolvedWidth,
	};
};

type RenderShapeParams = Pick<
	AtlSkeletonProps,
	'borderRadius' | 'className' | 'height' | 'size' | 'testId' | 'width'
> & {
	variant: AtlSkeletonShapeVariant;
};

export const renderSkeletonShape = ({
	borderRadius,
	className,
	height,
	size,
	testId,
	variant,
	width,
}: RenderShapeParams): JSX.Element => (
	<span
		aria-hidden="true"
		className={clsx('atl-skeleton', `atl-skeleton--${variant}`, className)}
		data-testid={testId}
		style={getShapeStyle({
			borderRadius,
			height,
			size,
			variant,
			width,
		})}
	/>
);
