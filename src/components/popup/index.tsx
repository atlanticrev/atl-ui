import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { useClickOutside } from '@/hooks/use-click-outside';
import { clsx } from '@/lib/clsx';

import type { AtlPopupProps } from './types';
import { usePopupPosition } from './use-popup-position';

export const AtlPopup = ({ anchorRef, children, className, flip = false, gap = 4, inputRootRef, isOpen, onClose, testId }: AtlPopupProps): JSX.Element | null => {
	const popupRef = useRef<HTMLDivElement>(null);
	const popupStyle = usePopupPosition({ anchorRef, flip, gap, inputRootRef, isOpen, popupRef });

	useClickOutside({ enabled: isOpen, onOutsideClick: onClose, refs: [anchorRef, popupRef] });

	if (!isOpen) {
		return null;
	}

	return createPortal(
		<div className={clsx('atl-popup', className)} data-testid={testId} ref={popupRef} style={popupStyle}>
			{children}
		</div>,
		document.body,
	);
};
