import type { ReactNode } from 'react';

import { AtlTooltip } from '@/components/tooltip';
import { clsx } from '@/lib/clsx';

type AtlInputRightIconProps = {
	icon: ReactNode;
	iconRotated: boolean;
	onClick?: () => void;
	testId: string;
	tooltip?: ReactNode;
	tooltipOpen?: boolean;
};

export const AtlInputRightIcon = ({
	icon,
	iconRotated,
	onClick,
	testId,
	tooltip,
	tooltipOpen,
}: AtlInputRightIconProps) => {
	const className = clsx(
		'atl-input__icon',
		'atl-input__icon--right',
		onClick && 'atl-input__icon--clickable',
		iconRotated && 'atl-input__icon--rotated',
	);

	const iconElement = onClick ? (
		<button className={className} tabIndex={-1} type="button" onClick={onClick}>
			{icon}
		</button>
	) : (
		<span className={className}>{icon}</span>
	);

	if (!tooltip) {
		return iconElement;
	}

	return (
		<AtlTooltip open={tooltipOpen} placement="top" testId={`${testId}-icon-tooltip`} title={tooltip}>
			{iconElement}
		</AtlTooltip>
	);
};
