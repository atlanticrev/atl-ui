import type { CSSProperties } from 'react';
import { useState } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlAvatarProps, BorderRadiusValue } from './types';

const getBorderRadius = (value: BorderRadiusValue | undefined): string => {
	if (value === undefined) {
		return '50%';
	}

	return typeof value === 'number' ? `${value}px` : value;
};

const normalizeInitials = (value: string): string => {
	return value.trim().replace(/\s+/g, '').slice(0, 3).toUpperCase();
};

export const AtlAvatar = (props: AtlAvatarProps): JSX.Element => {
	const [failedImage, setFailedImage] = useState<string | null>(null);
	const resolvedInitials = normalizeInitials(props.initials);
	const shouldRenderIcon = Boolean(props.icon);
	const shouldRenderImage = !shouldRenderIcon && Boolean(props.image) && failedImage !== props.image;
	const shouldShowInitials = !shouldRenderIcon && (!props.image || failedImage === props.image);
	const shouldShowLoader = !shouldRenderIcon && Boolean(props.image) && failedImage === props.image;
	const style = {
		'--atl-avatar-bg': props.backgroundColor,
		'--atl-avatar-icon-color': props.iconColor,
		'--atl-avatar-icon-scale': props.iconScale,
		'--atl-avatar-icon-size': props.iconSize,
		'--atl-avatar-image-fit': props.objectFit,
		'--atl-avatar-image-padding': props.imagePadding,
		'--atl-avatar-text-color': props.textColor,
		border: props.border ? `${props.border.width}px solid ${props.border.color}` : undefined,
		borderRadius: getBorderRadius(props.borderRadius),
		height: props.size ?? 32,
		width: props.size ?? 32,
	} as CSSProperties;

	const handleImageError = () => {
		setFailedImage(props.image ?? null);
		props.onImageError?.();
	};

	return (
		<div className={clsx('atl-avatar', props.className)} style={style}>
			{shouldRenderIcon && props.icon && <span className="atl-avatar__icon"><props.icon /></span>}
			{shouldRenderImage && (
				<img alt={props.imageAlt ?? ''} className="atl-avatar__image" src={props.image} onError={handleImageError} />
			)}
			{shouldShowInitials && <span className="atl-avatar__initials">{resolvedInitials}</span>}
			{shouldShowLoader && <span aria-hidden="true" className="atl-avatar__loader" />}
		</div>
	);
};
