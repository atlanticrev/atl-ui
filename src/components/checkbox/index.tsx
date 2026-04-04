import { useCallback } from 'react';

import { CheckIcon } from '@/icons/check-icon';
import { SpinnerIcon } from '@/icons/spinner-icon';
import { clsx } from '@/lib/clsx';

import type { AtlCheckboxProps } from './types';

export const AtlCheckbox = ({ checked = false, className, disabled = false, indeterminate = false, invalid = false, label, loading = false, onChange, onClick, size = 'm', testId }: AtlCheckboxProps): JSX.Element => {
	const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.checked), [onChange]);

	return (
		<label className={clsx('atl-checkbox', className, disabled && 'atl-checkbox--disabled')}>
			<input checked={checked} className="atl-checkbox__input" data-testid={testId} disabled={disabled} type="checkbox" onChange={handleChange} onClick={onClick} />

			<span className={clsx('atl-checkbox__control', `atl-checkbox__control--${size}`, (checked || indeterminate) && 'atl-checkbox__control--checked', invalid && 'atl-checkbox__control--invalid')}>
				{loading ? <SpinnerIcon size={14} /> : checked ? <CheckIcon size={16} /> : indeterminate ? '—' : null}
			</span>

			{label && <span>{label}</span>}
		</label>
	);
};
