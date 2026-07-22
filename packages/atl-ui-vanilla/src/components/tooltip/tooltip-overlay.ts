import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';

import type { AltTooltipPlacement, AltTooltipTrigger } from './types';

export type TooltipOverlayOptions = {
	onDismiss: () => void;
	panel: HTMLElement;
	placement: AltTooltipPlacement;
	signal: AbortSignal;
	trigger: AltTooltipTrigger;
	triggerElement: HTMLElement;
};

export const bindTooltipOverlay = (options: TooltipOverlayOptions): (() => void) => {
	return bindAnchoredOverlay({
		anchor: options.triggerElement,
		gap: 8,
		onDismiss: options.trigger === 'click' ? options.onDismiss : undefined,
		overlay: options.panel,
		placement: options.placement,
		signal: options.signal,
	});
};
