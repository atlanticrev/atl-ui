import { useCallback, useRef } from 'react';

import { useKeyPress } from '@/hooks/use-key-press';
import { clsx } from '@/lib/clsx';

import type { AtlSwitcherProps } from './types';

export const AtlSwitcher = ({ checked = false, className, disabled = false, onChange, size = 'L', testId }: AtlSwitcherProps): JSX.Element => {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const toggle = useCallback(() => {
		if (!disabled) {
			onChange?.(!checked);
		}
	}, [checked, disabled, onChange]);

	useKeyPress({ elementRef: buttonRef, key: ' ', onKeyPress: toggle, preventDefault: true });
	useKeyPress({ elementRef: buttonRef, key: 'Enter', onKeyPress: toggle, preventDefault: true });

	return (
		<button aria-checked={checked} className={clsx('atl-switcher', `atl-switcher--${size.toLowerCase()}`, checked && 'atl-switcher--checked', disabled && 'atl-switcher--disabled', className)} data-testid={testId} disabled={disabled} ref={buttonRef} role="switch" type="button" onClick={toggle}>
			<span className="atl-switcher__knob" />
		</button>
	);
};
