import type { ReactNode, RefObject } from 'react';

export type AtlPopupProps = {
	anchorRef: RefObject<HTMLElement | null>;
	children: ReactNode;
	className?: string;
	flip?: boolean;
	gap?: number;
	inputRootRef?: RefObject<HTMLElement | null>;
	isOpen: boolean;
	onClose: () => void;
	testId: string;
};
