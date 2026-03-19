import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useState } from 'react';

import { clsx } from '@/lib/clsx';

import type { AtlTooltipProps } from './types';

export const AtlTooltip = ({ children, className, open, placement = 'top', testId, title, trigger = 'hover' }: AtlTooltipProps): JSX.Element => {
	const [isOpen, setIsOpen] = useState(false);
	const visible = open ?? isOpen;
	const show = useCallback(() => setIsOpen(true), []);
	const hide = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		setIsOpen((current) => !current);
	}, []);
	const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setIsOpen((current) => !current);
		}
	}, []);

	return (
		<button
			className={clsx('atl-tooltip', className)}
			onBlur={hide}
			onClick={trigger === 'click' ? toggle : undefined}
			onFocus={show}
			onKeyDown={trigger === 'click' ? handleKeyDown : undefined}
			onMouseEnter={trigger === 'hover' ? show : undefined}
			onMouseLeave={trigger === 'hover' ? hide : undefined}
			type="button"
		>
			{children}
			{visible && <span className={clsx('atl-tooltip__panel', `atl-tooltip__panel--${placement}`)} data-testid={testId} role="tooltip">{title}</span>}
		</button>
	);
};
