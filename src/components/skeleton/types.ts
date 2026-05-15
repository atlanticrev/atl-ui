import type { CSSProperties, ReactNode } from 'react';

export type AtlSkeletonShapeVariant = 'line' | 'rect' | 'circle';

export type AtlSkeletonVariant = 'overlay' | AtlSkeletonShapeVariant;

export type AtlSkeletonProps = {
	borderRadius?: CSSProperties['borderRadius'];
	children?: ReactNode;
	className?: string;
	height?: CSSProperties['height'];
	loading?: boolean;
	size?: CSSProperties['width'];
	testId?: string;
	variant?: AtlSkeletonVariant;
	width?: CSSProperties['width'];
};

export type AtlSkeletonRepeatProps = {
	children: ReactNode;
	className?: string;
	count: number;
	gap?: CSSProperties['gap'];
	testId?: string;
};
