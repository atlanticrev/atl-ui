export type OverlayPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';

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

const resolvePlacement = (
	anchor: RectLike,
	overlay: RectLike,
	viewport: ViewportSize,
	preferred: OverlayPlacement,
	gap: number,
	padding: number,
	flip: boolean,
): OverlayPlacement => {
	if (!flip) {
		return preferred;
	}

	const preferredSide = preferred.startsWith('bottom') ? 'bottom' : 'top';
	const availableBottom = viewport.height - padding - anchor.bottom - gap;
	const availableTop = anchor.top - padding - gap;
	const shouldFlip =
		preferredSide === 'bottom'
			? overlay.height > availableBottom && availableTop > availableBottom
			: overlay.height > availableTop && availableBottom > availableTop;

	if (!shouldFlip) {
		return preferred;
	}

	return preferredSide === 'bottom'
		? (preferred.replace('bottom', 'top') as OverlayPlacement)
		: (preferred.replace('top', 'bottom') as OverlayPlacement);
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
	const placement = resolvePlacement(anchor, overlay, viewport, preferred, gap, padding, options.flip ?? true);
	const rawLeft = placement.endsWith('end') ? anchor.right - overlay.width : anchor.left;
	const rawTop = placement.startsWith('bottom') ? anchor.bottom + gap : anchor.top - overlay.height - gap;
	const maximumLeft = viewport.width - padding - overlay.width;
	const maximumTop = viewport.height - padding - overlay.height;

	return {
		left: clamp(rawLeft, padding, maximumLeft),
		placement,
		top: clamp(rawTop, padding, maximumTop),
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
