import { bindSwipeDismiss, type SwipeDismissSettleDetail } from '../../controllers/swipe-dismiss';

import { setDrawerDrag } from './drawer-motion';
import type { AltDrawerPlacement } from './types';

type DrawerInteractionsOptions = {
	dialog: HTMLDialogElement;
	enabled: () => boolean;
	onAction: (returnValue: string) => void;
	onDragStart: () => void;
	onSettle: (detail: SwipeDismissSettleDetail) => void;
	placement: () => AltDrawerPlacement;
	signal: AbortSignal;
};

export const bindDrawerInteractions = (options: DrawerInteractionsOptions): void => {
	options.dialog.addEventListener(
		'click',
		(event) => {
			const target = event.target as Element | null;

			const close = target?.closest<HTMLElement>('[data-alt-drawer-close]');

			if (close && options.dialog.contains(close)) options.onAction(close.dataset.altDrawerClose ?? '');
		},
		{ signal: options.signal },
	);

	bindSwipeDismiss({
		enabled: options.enabled,
		onDrag: ({ closingOffset, placement, progress }) => {
			setDrawerDrag(options.dialog, placement, closingOffset, progress);
		},
		onDragStart: options.onDragStart,
		onSettle: options.onSettle,
		placement: options.placement,
		signal: options.signal,
		surface: options.dialog,
	});
};
