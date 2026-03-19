import type { ComponentType, ReactNode, SVGProps } from 'react';

export type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>;
export type BorderRadiusValue = `${number}%` | `${number}px` | number;
export type InitialsTypographyVariant = 'headline';

type CircleIconBaseProps = {
	backgroundColor?: string;
	border?: {
		color: string;
		width: number;
	};
	borderRadius?: BorderRadiusValue;
	className?: string;
	size: number;
};

export type CircleIconImageProps = CircleIconBaseProps & {
	contentType: 'image';
	imageAlt?: string;
	imagePadding?: string;
	imageUrl: string;
	objectFit?: 'cover' | 'contain';
	onImageError?: () => void;
};

export type CircleIconInitialsProps = CircleIconBaseProps & {
	contentType: 'initials';
	initials: string;
	textColor?: string;
	typography?: InitialsTypographyVariant;
};

export type CircleIconIconProps = CircleIconBaseProps & {
	contentType: 'icon';
	icon: SvgIconComponent;
	iconColor?: string;
	iconScale?: number;
	iconSize?: number | string;
};

export type CircleIconCustomProps = CircleIconBaseProps & {
	children: ReactNode;
	contentType: 'custom';
};

export type AtlCircleIconProps =
	| CircleIconImageProps
	| CircleIconInitialsProps
	| CircleIconIconProps
	| CircleIconCustomProps;
