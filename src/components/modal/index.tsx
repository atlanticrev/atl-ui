import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { AtlButton } from '@/components/button';
import { CloseCircleIcon } from '@/icons/close-circle-icon';
import { useClickOutside } from '@/hooks/use-click-outside';
import { useFocusTrap } from '@/hooks/use-focus-trap';
import { useKeyPress } from '@/hooks/use-key-press';
import { clsx } from '@/lib/clsx';

import type { AtlModalProps } from './types';

export const AtlModal = ({ cancelText = 'Cancel', children, className, confirmText = 'Confirm', confirmVariant = 'filled', footer, header, isCloseHidden = false, isDisabled = false, isLoading = false, isOpen, onCancel, onClose, onConfirm, size = 520, testId, title, ...props }: AtlModalProps): JSX.Element | null => {
	const contentRef = useRef<HTMLDivElement>(null);
	const handleCancel = onCancel ?? onClose;
	const handleConfirm = onConfirm ?? onClose;

	useClickOutside({ enabled: isOpen, onOutsideClick: onClose, refs: [contentRef] });
	useFocusTrap({ enabled: isOpen, rootRef: contentRef });
	useKeyPress({ enabled: isOpen, key: 'Escape', onKeyPress: onClose });

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	return createPortal(
		<div className="atl-modal__backdrop" data-testid={`${testId}-backdrop`}>
			<div {...props} aria-modal="true" className={clsx('atl-modal', className)} data-testid={testId} ref={contentRef} role="dialog" style={{ '--atl-modal-width': `${size}px` } as CSSProperties}>
				{header ?? (
					<div className="atl-modal__header">
						{title && <p className="atl-modal__title">{title}</p>}
						{!isCloseHidden && <button className="atl-modal__close" type="button" onClick={onClose}><CloseCircleIcon size={24} /></button>}
					</div>
				)}
				<div className="atl-modal__body">{children}</div>
				{footer ?? (
					<div className="atl-modal__footer">
						<AtlButton variant="text" onClick={handleCancel}>{cancelText}</AtlButton>
						<AtlButton disabled={isDisabled || isLoading} loading={isLoading} variant={confirmVariant} onClick={handleConfirm}>{confirmText}</AtlButton>
					</div>
				)}
			</div>
		</div>,
		document.body,
	);
};
