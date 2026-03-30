import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useRef } from 'react';

import { useOverlayDismiss } from '@/hooks/use-overlay-dismiss';
import { useOverlayState } from '@/hooks/use-overlay-state';
import { clsx } from '@/lib/clsx';

import type { AtlTooltipProps } from './types';

export const AtlTooltip = ({ children, className, defaultOpen = false, onOpenChange, open, placement = 'top', testId, title, trigger = 'hover' }: AtlTooltipProps): JSX.Element => {
	const triggerRef = useRef<HTMLButtonElement>(null);
	const panelRef = useRef<HTMLSpanElement>(null);
	const overlay = useOverlayState({ defaultOpen, onOpenChange, open });
	const isClickTrigger = trigger === 'click';
	const show = useCallback(() => overlay.openOverlay(), [overlay]);
	const hide = useCallback(() => overlay.closeOverlay(), [overlay]);
	const toggle = useCallback((event: MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		overlay.toggleOverlay();
	}, [overlay]);
	const handleKeyDown = useCallback((event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			overlay.toggleOverlay();
		}
	}, [overlay]);
	const panel = overlay.isOpen
		? <span className={clsx('atl-tooltip__panel', `atl-tooltip__panel--${placement}`)} data-testid={testId} ref={panelRef} role="tooltip">{title}</span>
		: null;

	useOverlayDismiss({
		closeOnEscape: isClickTrigger,
		closeOnOutsideClick: isClickTrigger,
		enabled: overlay.isOpen,
		onClose: hide,
		refs: [triggerRef, panelRef],
	});

	return (
		<button className={clsx('atl-tooltip', className)} onBlur={isClickTrigger ? undefined : hide} onClick={isClickTrigger ? toggle : undefined} onFocus={show} onKeyDown={isClickTrigger ? handleKeyDown : undefined} onMouseEnter={isClickTrigger ? undefined : show} onMouseLeave={isClickTrigger ? undefined : hide} ref={triggerRef} type="button">
			{children}
			{panel}
		</button>
	);
};
