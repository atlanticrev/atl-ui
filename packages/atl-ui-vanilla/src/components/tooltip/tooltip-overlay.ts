import { bindOverlayDismiss, bindOverlayPosition } from '../../controllers';

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
	const position = bindOverlayPosition({
		anchor: options.triggerElement,
		gap: 8,
		onPosition: (next) => {
			options.panel.style.left = `${next.left}px`;

			options.panel.style.top = `${next.top}px`;
		},
		overlay: options.panel,
		placement: options.placement,
		signal: options.signal,
	});

	const dismiss =
		options.trigger === 'click'
			? bindOverlayDismiss({
					ignore: [options.triggerElement],
					onDismiss: options.onDismiss,
					overlay: options.panel,
					signal: options.signal,
				})
			: undefined;

	return () => {
		position();

		dismiss?.();
	};
};
