import type { HTMLAttributes, ReactNode } from 'react';

import type { ButtonVariant } from '@/components/button/types';

export type ModalContentSize = 520 | 620 | 760 | 848;

export type AtlModalProps = HTMLAttributes<HTMLDivElement> & {
	cancelText?: string;
	children: ReactNode;
	confirmText?: string;
	confirmVariant?: ButtonVariant;
	footer?: ReactNode;
	header?: ReactNode;
	isCloseHidden?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	isOpen: boolean;
	onCancel?: () => void;
	onClose: () => void;
	onConfirm?: () => void;
	size?: ModalContentSize;
	testId: string;
	title?: ReactNode;
};
