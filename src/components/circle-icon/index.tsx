import type { CSSProperties } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlCircleIconProps, BorderRadiusValue } from './types';

const getBorderRadius = (value: BorderRadiusValue | undefined): string => {
	if (value === undefined) {
		return '50%';
	}

	return typeof value === 'number' ? `${value}px` : value;
};

export const AtlCircleIcon = (props: AtlCircleIconProps): JSX.Element => {
	const style = {
		'--atl-circle-icon-bg': props.backgroundColor,
		'--atl-circle-icon-icon-color': props.contentType === 'icon' ? props.iconColor : undefined,
		'--atl-circle-icon-icon-scale': props.contentType === 'icon' ? props.iconScale : undefined,
		'--atl-circle-icon-icon-size': props.contentType === 'icon' ? props.iconSize : undefined,
		'--atl-circle-icon-image-fit': props.contentType === 'image' ? props.objectFit : undefined,
		'--atl-circle-icon-image-padding': props.contentType === 'image' ? props.imagePadding : undefined,
		'--atl-circle-icon-text-color': props.contentType === 'initials' ? props.textColor : undefined,
		border: props.border ? `${props.border.width}px solid ${props.border.color}` : undefined,
		borderRadius: getBorderRadius(props.borderRadius),
		height: props.size,
		width: props.size,
	} as CSSProperties;

	return (
		<div className={clsx('atl-circle-icon', props.className)} style={style}>
			{props.contentType === 'image' && <img alt={props.imageAlt ?? ''} className="atl-circle-icon__image" src={props.imageUrl} onError={props.onImageError} />}
			{props.contentType === 'initials' && <span className="atl-circle-icon__initials">{props.initials}</span>}
			{props.contentType === 'icon' && <span className="atl-circle-icon__icon"><props.icon /></span>}
			{props.contentType === 'custom' && props.children}
		</div>
	);
};
