import type { OverlayDismissDetail } from '../../controllers';
import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';

const MOBILE_BREAKPOINT = 520;

export const bindDatePickerOverlay = (
	panel: HTMLDivElement,
	trigger: HTMLElement,
	onDismiss: (detail: OverlayDismissDetail) => void,
	signal: AbortSignal,
): (() => void) => {
	const view = trigger.ownerDocument.defaultView;

	return bindAnchoredOverlay({
		anchor: trigger,
		flip: true,
		gap: 8,
		onDismiss,
		onPosition: ({ left, top }) => {
			const viewportWidth = view?.innerWidth ?? trigger.ownerDocument.documentElement.clientWidth;

			if (viewportWidth <= MOBILE_BREAKPOINT) {
				panel.style.removeProperty('left');

				panel.style.removeProperty('top');

				return;
			}

			panel.style.left = `${left}px`;

			panel.style.top = `${top}px`;
		},
		overlay: panel,
		placement: 'bottom-start',
		signal,
	});
};
