import type { OverlayPlacement } from '../../controllers';
import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';

export type PopupOverlayOptions = {
	anchor: Element;
	closeOnEscape: boolean;
	closeOnOutsideClick: boolean;
	flip: boolean;
	gap: number;
	onDismiss: () => void;
	placement: OverlayPlacement;
	signal: AbortSignal;
};

export const bindPopupOverlay = (host: HTMLElement, options: PopupOverlayOptions): (() => void) => {
	return bindAnchoredOverlay({
		anchor: options.anchor,
		flip: options.flip,
		gap: options.gap,
		onDismiss: ({ reason }) => {
			const enabled = reason === 'escape' ? options.closeOnEscape : options.closeOnOutsideClick;

			if (enabled) options.onDismiss();
		},
		overlay: host,
		placement: options.placement,
		signal: options.signal,
	});
};
