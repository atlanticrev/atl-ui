import { bindOverlayDismiss, bindOverlayPosition, type OverlayPlacement } from '../../controllers';

type PopoverHost = HTMLElement & {
	togglePopover?: (force?: boolean) => boolean;
};

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

export const setPopupPopoverOpen = (host: HTMLElement, open: boolean): void => {
	(host as PopoverHost).togglePopover?.(open);
};

export const bindPopupOverlay = (host: HTMLElement, options: PopupOverlayOptions): (() => void) => {
	setPopupPopoverOpen(host, true);
	const dismiss = bindOverlayDismiss({
		ignore: [options.anchor],
		onDismiss: ({ reason }) => {
			const enabled = reason === 'escape' ? options.closeOnEscape : options.closeOnOutsideClick;
			if (enabled) options.onDismiss();
		},
		overlay: host,
		signal: options.signal,
	});
	const position = bindOverlayPosition({
		anchor: options.anchor,
		flip: options.flip,
		gap: options.gap,
		onPosition: (next) => {
			host.dataset.placement = next.placement;
			host.style.left = `${next.left}px`;
			host.style.top = `${next.top}px`;
		},
		overlay: host,
		placement: options.placement,
		signal: options.signal,
	});
	return () => {
		dismiss();
		position();
	};
};
