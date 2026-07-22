import type { OverlayPlacement, RectLike, ViewportSize } from './position';

const getSide = (placement: OverlayPlacement): 'bottom' | 'left' | 'right' | 'top' => {
	if (placement.startsWith('bottom')) return 'bottom';

	if (placement.startsWith('top')) return 'top';

	return placement === 'left' ? 'left' : 'right';
};

export const resolveOverlayPlacement = (
	anchor: RectLike,
	overlay: RectLike,
	viewport: ViewportSize,
	preferred: OverlayPlacement,
	gap: number,
	padding: number,
	flip: boolean,
): OverlayPlacement => {
	if (!flip) return preferred;

	const side = getSide(preferred);

	const spaces = {
		bottom: viewport.height - padding - anchor.bottom - gap,
		left: anchor.left - padding - gap,
		right: viewport.width - padding - anchor.right - gap,
		top: anchor.top - padding - gap,
	};

	const opposites = {
		bottom: 'top',
		left: 'right',
		right: 'left',
		top: 'bottom',
	} as const;

	const opposite = opposites[side];

	const vertical = side === 'bottom' || side === 'top';

	const overlaySize = vertical ? overlay.height : overlay.width;

	if (overlaySize <= spaces[side] || spaces[opposite] <= spaces[side]) return preferred;

	return preferred.replace(side, opposite) as OverlayPlacement;
};

export const resolveOverlayCoordinates = (
	anchor: RectLike,
	overlay: RectLike,
	placement: OverlayPlacement,
	gap: number,
): { left: number; top: number } => {
	const horizontalCenter = anchor.left + (anchor.width - overlay.width) / 2;

	const verticalCenter = anchor.top + (anchor.height - overlay.height) / 2;

	const left =
		placement === 'left'
			? anchor.left - overlay.width - gap
			: placement === 'right'
				? anchor.right + gap
				: placement.endsWith('end')
					? anchor.right - overlay.width
					: placement.endsWith('start')
						? anchor.left
						: horizontalCenter;

	const top = placement.startsWith('bottom')
		? anchor.bottom + gap
		: placement.startsWith('top')
			? anchor.top - overlay.height - gap
			: verticalCenter;

	return {
		left,
		top,
	};
};
