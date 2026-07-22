import { bindOverlayDismiss, type OverlayDismissDetail } from './dismiss';
import type { OverlayPosition, OverlayPositionOptions } from './position';
import { bindOverlayPosition } from './position-observer';
import { bindOverlayLayer } from './overlay-layer';

export type AnchoredOverlayOptions = OverlayPositionOptions & {
	anchor: Element;
	ignore?: readonly Element[];
	matchAnchorWidth?: boolean;
	onDismiss?: (detail: OverlayDismissDetail) => void;
	onPosition?: (position: OverlayPosition) => void;
	overlay: HTMLElement;
	signal?: AbortSignal;
};

type OverlayInlineState = {
	left: string;
	minWidth: string;
	placement: string | undefined;
	top: string;
};

const captureInlineState = (overlay: HTMLElement): OverlayInlineState => ({
	left: overlay.style.left,
	minWidth: overlay.style.minWidth,
	placement: overlay.dataset.placement,
	top: overlay.style.top,
});

const restoreInlineState = (overlay: HTMLElement, state: OverlayInlineState): void => {
	overlay.style.left = state.left;

	overlay.style.minWidth = state.minWidth;

	overlay.style.top = state.top;

	if (state.placement === undefined) delete overlay.dataset.placement;
	else overlay.dataset.placement = state.placement;
};

export const bindAnchoredOverlay = (options: AnchoredOverlayOptions): (() => void) => {
	if (options.signal?.aborted) return (): void => undefined;

	const inlineState = captureInlineState(options.overlay);

	const layer = bindOverlayLayer(options.overlay);

	const dismiss = options.onDismiss
		? bindOverlayDismiss({
				ignore: [options.anchor, ...(options.ignore ?? [])],
				onDismiss: options.onDismiss,
				overlay: options.overlay,
			})
		: undefined;

	const position = bindOverlayPosition({
		anchor: options.anchor,
		flip: options.flip,
		gap: options.gap,
		onPosition: (next) => {
			options.overlay.dataset.placement = next.placement;

			options.overlay.style.left = `${next.left}px`;

			if (options.matchAnchorWidth) {
				options.overlay.style.minWidth = `${options.anchor.getBoundingClientRect().width}px`;
			}

			options.overlay.style.top = `${next.top}px`;

			options.onPosition?.(next);
		},
		overlay: options.overlay,
		padding: options.padding,
		placement: options.placement,
	});

	let active = true;

	const cleanup = (): void => {
		if (!active) return;

		active = false;

		options.signal?.removeEventListener('abort', cleanup);

		dismiss?.();

		position();

		layer();

		restoreInlineState(options.overlay, inlineState);
	};

	options.signal?.addEventListener('abort', cleanup, { once: true });

	return cleanup;
};
