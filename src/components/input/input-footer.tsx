import { clsx } from '@/lib/clsx';

import type { AtlInputStatus } from './input.type';

type AtlInputFooterProps = {
	helperText?: string;
	helperTextId?: string;
	maxLength?: number;
	showCharacterCount: boolean;
	status: AtlInputStatus;
	value?: string;
};

export const AtlInputFooter = ({
	helperText,
	helperTextId,
	maxLength,
	showCharacterCount,
	status,
	value,
}: AtlInputFooterProps) => {
	const shouldShowCounter = Boolean(showCharacterCount && maxLength);

	if (!helperText && !shouldShowCounter) {
		return null;
	}

	return (
		<div className="atl-input__footer">
			{helperText && (
				<span
					className={clsx(
						'atl-input__helper',
						status === 'error' && 'atl-input__helper--error',
						status === 'success' && 'atl-input__helper--success',
					)}
					id={helperTextId}
				>
					{helperText}
				</span>
			)}

			{shouldShowCounter && (
				<output aria-atomic="true" aria-live="polite" className="atl-input__counter">
					<span className="atl-input__counter-current">{value?.length ?? 0}</span>

					<span className="atl-input__counter-total">/{maxLength}</span>
				</output>
			)}
		</div>
	);
};
