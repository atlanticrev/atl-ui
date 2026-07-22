import type { CSSProperties } from 'react';

import { AtlButton } from '@/components/button';
import { CrossIcon } from '@/icons/cross-icon';
import { clsx } from '@/lib/clsx';

import type { AtlChipProps } from './types';

export const AtlChip = ({
	customColors,
	disabled = false,
	label,
	onRemove,
	size = 'M',
	testId,
	variant = 'default',
	withCross = false,
}: AtlChipProps): JSX.Element => {
	const inlineStyles = customColors
		? ({ background: customColors.background, color: customColors.text } as CSSProperties)
		: undefined;

	return (
		<span
			className={clsx(
				'atl-chip',
				`atl-chip--size-${size.toLowerCase()}`,
				`atl-chip--${variant}`,
				disabled && 'atl-chip--disabled',
			)}
			data-testid={testId}
			style={inlineStyles}
		>
			<span>{label}</span>

			{withCross && (
				<AtlButton
					aria-label={`Remove ${label}`}
					className="atl-chip__remove"
					disabled={disabled}
					iconLeft={<CrossIcon />}
					size={24}
					variant="text"
					onClick={onRemove}
				/>
			)}
		</span>
	);
};
