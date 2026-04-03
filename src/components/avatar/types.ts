import type { ComponentType, SVGProps } from 'react';

export type SvgIconComponent = ComponentType<
	SVGProps<SVGSVGElement> & {
		size?: number;
	}
>;
export type BorderRadiusValue = `${number}%` | `${number}px` | number;
export type AvatarSize = 24 | 32 | 40 | 48 | 64 | number;

export type AtlAvatarProps = {
	backgroundColor?: string;
	border?: {
		color: string;
		width: number;
	};
	borderRadius?: BorderRadiusValue;
	className?: string;
	icon?: SvgIconComponent;
	iconColor?: string;
	iconScale?: number;
	iconSize?: number | string;
	image?: string;
	imageAlt?: string;
	imagePadding?: string;
	initials: string;
	objectFit?: 'cover' | 'contain';
	onImageError?: () => void;
	size?: AvatarSize;
	textColor?: string;
};
