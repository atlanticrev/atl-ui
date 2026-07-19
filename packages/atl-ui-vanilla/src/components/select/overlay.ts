import { bindOverlayDismiss, bindOverlayPosition } from '../../controllers';

import type { SelectDom } from './dom';

type PopoverElement = HTMLElement & {
	togglePopover?: (force?: boolean) => boolean;
};

export const showSelectOverlay = (dom: SelectDom, onDismiss: () => void, signal: AbortSignal): (() => void) => {
	const popup = dom.popup as PopoverElement;
	popup.togglePopover?.(true);
	const cleanupDismiss = bindOverlayDismiss({
		ignore: [dom.trigger],
		onDismiss,
		overlay: popup,
		signal,
	});
	const cleanupPosition = bindOverlayPosition({
		anchor: dom.trigger,
		onPosition: (position) => {
			popup.style.left = `${position.left}px`;
			popup.style.minWidth = `${dom.trigger.getBoundingClientRect().width}px`;
			popup.style.top = `${position.top}px`;
		},
		overlay: popup,
		signal,
	});

	return (): void => {
		cleanupDismiss();
		cleanupPosition();

		if (popup.isConnected) {
			popup.togglePopover?.(false);
		}
	};
};
