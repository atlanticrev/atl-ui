import type { ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type AtlTooltipProps = {
	children: ReactNode;
	className?: string;
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	open?: boolean;
	placement?: TooltipPlacement;
	testId?: string;
	title: ReactNode;
	trigger?: 'hover' | 'click';
};
