import { clsx } from '@/lib/clsx';

import type { AtlRadioButtonProps } from './types';

export const AtlRadioButton = ({ checked, disabled, invalid = false, label, size = 24, testId, ...props }: AtlRadioButtonProps): JSX.Element => {
	return (
		<label className="atl-radio-button">
			<input {...props} checked={checked} className="atl-radio-button__input" data-testid={testId} disabled={disabled} type="radio" />
			<span className={clsx('atl-radio-button__control', `atl-radio-button__control--${size}`, checked && 'atl-radio-button__control--checked', invalid && 'atl-radio-button__control--invalid')} />
			{label && <span>{label}</span>}
		</label>
	);
};
