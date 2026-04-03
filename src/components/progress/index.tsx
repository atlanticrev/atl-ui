import { useId } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlProgressProps } from './types';
import {
	clampProgressValue,
	getProgressPercent,
	normalizeProgressMax,
} from './utils';

const INDETERMINATE_FILL_WIDTH = '38%';

export const AtlProgress = ({
	ariaLabel,
	className,
	indeterminate = false,
	label,
	max = 100,
	showValue = true,
	size = 'md',
	status = 'default',
	testId,
	value = 0,
}: AtlProgressProps): JSX.Element => {
	const labelId = useId();

	const safeMax = normalizeProgressMax(max);
	const safeValue = clampProgressValue(value, safeMax);
	const percent = getProgressPercent(safeValue, safeMax);
	
	const shouldRenderValue = showValue && !indeterminate;
	const shouldRenderHeader = Boolean(label) || shouldRenderValue;
	
	const fillWidth = indeterminate ? INDETERMINATE_FILL_WIDTH : `${percent}%`;
	const labelledBy = label ? labelId : undefined;
	const resolvedAriaLabel = labelledBy ? undefined : ariaLabel ?? 'Progress';

	return (
		<div
			className={clsx(
				'atl-progress',
				`atl-progress--${size}`,
				`atl-progress--${status}`,
				indeterminate && 'atl-progress--indeterminate',
				className,
			)}
			data-testid={testId}
		>
			{shouldRenderHeader ? (
				<div className="atl-progress__header">
					{label ? (
						<span className="atl-progress__label" id={labelId}>
							{label}
						</span>
					) : null}

					{shouldRenderValue ? (
						<span className="atl-progress__value">{percent}%</span>
					) : null}
				</div>
			) : null}

			<div
				aria-label={resolvedAriaLabel}
				aria-labelledby={labelledBy}
				aria-valuemax={safeMax}
				aria-valuemin={0}
				aria-valuenow={indeterminate ? undefined : safeValue}
				className="atl-progress__track"
				role="progressbar"
			>
				<span className="atl-progress__fill" style={{ width: fillWidth }} />
			</div>
		</div>
	);
};
