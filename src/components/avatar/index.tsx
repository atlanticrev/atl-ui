import { useMemo } from 'react';

import { AtlCircleIcon } from '@/components/circle-icon';
import { SuitcaseIcon } from '@/icons/suitcase-icon';

import { AVATAR_CONFIG } from './config';
import type { AtlAvatarProps } from './types';

const getInitials = (name: string): string => {
	const words = name.trim().split(/\s+/);

	if (words.length === 1) {
		return words[0].slice(0, 2).toUpperCase();
	}

	return words.slice(0, 2).map((word) => word[0]?.toUpperCase() ?? '').join('');
};

export const AtlAvatar = ({
	backgroundColor,
	className,
	fullName,
	imageUrl,
	initials,
	logoIcon,
	size = 32,
	type,
	variant,
}: AtlAvatarProps): JSX.Element => {
	const resolvedInitials = useMemo(() => initials ?? getInitials(fullName), [fullName, initials]);
	const config = AVATAR_CONFIG[variant][type];
	const bgColor = backgroundColor ?? config?.backgroundColor;

	if (type === 'photo' && imageUrl) {
		return <AtlCircleIcon className={className} contentType="image" imageAlt={fullName} imageUrl={imageUrl} size={size} />;
	}

	if (type === 'logo' && logoIcon) {
		return <AtlCircleIcon backgroundColor={bgColor} className={className} contentType="icon" icon={logoIcon} size={size} />;
	}

	if (type === 'logo' && imageUrl) {
		return <AtlCircleIcon backgroundColor={bgColor} className={className} contentType="image" imageAlt={fullName} imagePadding="20%" imageUrl={imageUrl} objectFit="contain" size={size} />;
	}

	if (type === 'company') {
		return <AtlCircleIcon backgroundColor={bgColor} className={className} contentType="icon" icon={SuitcaseIcon} iconColor={config?.iconColor} size={size} />;
	}

	return <AtlCircleIcon backgroundColor={bgColor} className={className} contentType="initials" initials={resolvedInitials} size={size} textColor={config?.textColor} />;
};
