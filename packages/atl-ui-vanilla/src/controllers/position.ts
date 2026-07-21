export type OverlayPlacement =
	| 'bottom'
	| 'bottom-end'
	| 'bottom-start'
	| 'left'
	| 'right'
	| 'top'
	| 'top-end'
	| 'top-start';

export type RectLike = Pick<DOMRectReadOnly, 'bottom' | 'height' | 'left' | 'right' | 'top' | 'width'>;

export type ViewportSize = {
	height: number;
	width: number;
};

export type OverlayPositionOptions = {
	flip?: boolean;
	gap?: number;
	padding?: number;
	placement?: OverlayPlacement;
};

export type OverlayPosition = {
	left: number;
	placement: OverlayPlacement;
	top: number;
};

const clamp = (value: number, minimum: number, maximum: number): number => {
	return Math.min(Math.max(minimum, value), Math.max(minimum, maximum));
};

export const calculateOverlayPosition = (
	anchor: RectLike,
	overlay: RectLike,
	viewport: ViewportSize,
	options: OverlayPositionOptions = {},
): OverlayPosition => {
	const gap = options.gap ?? 4;
	const padding = options.padding ?? 8;
	const preferred = options.placement ?? 'bottom-start';
	const placement = resolveOverlayPlacement(anchor, overlay, viewport, preferred, gap, padding, options.flip ?? true);
	const coordinates = resolveOverlayCoordinates(anchor, overlay, placement, gap);
	const maximumLeft = viewport.width - padding - overlay.width;
	const maximumTop = viewport.height - padding - overlay.height;

	return {
		left: clamp(coordinates.left, padding, maximumLeft),
		placement,
		top: clamp(coordinates.top, padding, maximumTop),
	};
};

export const measureOverlayPosition = (
	anchor: Element,
	overlay: Element,
	options: OverlayPositionOptions = {},
): OverlayPosition => {
	const view = anchor.ownerDocument.defaultView;
	const viewport = {
		height: view?.innerHeight ?? anchor.ownerDocument.documentElement.clientHeight,
		width: view?.innerWidth ?? anchor.ownerDocument.documentElement.clientWidth,
	};

	return calculateOverlayPosition(anchor.getBoundingClientRect(), overlay.getBoundingClientRect(), viewport, options);
};

import { resolveOverlayCoordinates, resolveOverlayPlacement } from './position-placement';
