import { bindCompatibilityClickGuard } from './compatibility-click-guard';
import {
	getClosingDistance,
	getSwipeProgress,
	getSwipeSnapDuration,
	isSwipeDismissGesture,
	isSwipeFling,
	type SwipeDismissPlacement,
	shouldDismissSwipe,
} from './swipe-dismiss-gesture';
import { createSwipeTracking, type SwipeTracking, updateSwipeVelocity } from './swipe-dismiss-tracking';

export type SwipeDismissDragDetail = {
	closingOffset: number;
	placement: SwipeDismissPlacement;
	progress: number;
};

export type SwipeDismissSettleDetail = {
	dismiss: boolean;
	duration: number;
	placement: SwipeDismissPlacement;
	progress: number;
};

type SwipeDismissOptions = {
	enabled: () => boolean;
	onDrag: (detail: SwipeDismissDragDetail) => void;
	onDragStart?: () => void;
	onSettle: (detail: SwipeDismissSettleDetail) => void;
	placement: () => SwipeDismissPlacement;
	signal: AbortSignal;
	surface: HTMLElement;
};

const getSurfaceSize = (surface: HTMLElement, placement: SwipeDismissPlacement): number => {
	return placement === 'left' || placement === 'right' ? surface.offsetWidth : surface.offsetHeight;
};

const canStartVerticalDrag = (
	surface: HTMLElement,
	tracking: SwipeTracking,
	placement: SwipeDismissPlacement,
): boolean => {
	const view = surface.ownerDocument.defaultView;

	if (!view || !(tracking.startTarget instanceof view.Element)) return true;

	const handle = tracking.startTarget.closest('[data-alt-drawer-handle]');

	if (handle && surface.contains(handle)) return true;

	const scroll = tracking.startTarget.closest<HTMLElement>('[data-alt-drawer-scroll], .alt-drawer__body');

	if (!scroll || !surface.contains(scroll) || scroll.scrollHeight <= scroll.clientHeight) return true;

	if (placement === 'bottom') return scroll.scrollTop <= 0;

	return scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 1;
};

export const bindSwipeDismiss = (options: SwipeDismissOptions): void => {
	let tracking: SwipeTracking | null = null;

	const clickGuard = bindCompatibilityClickGuard(options.surface);

	const finish = (cancelled: boolean): void => {
		if (!tracking?.dragging) {
			tracking = null;

			return;
		}

		const placement = options.placement();

		const progress = getSwipeProgress(tracking.closingOffset, getSurfaceSize(options.surface, placement));

		const motion = { progress, velocityX: tracking.velocityX, velocityY: tracking.velocityY };

		const dismiss = cancelled ? false : shouldDismissSwipe(placement, motion);

		clickGuard.arm();

		options.onSettle({
			dismiss,
			duration: getSwipeSnapDuration(progress, dismiss, isSwipeFling(placement, motion)),
			placement,
			progress,
		});

		tracking = null;
	};

	options.surface.addEventListener(
		'touchstart',
		(event) => {
			if (!options.enabled() || event.touches.length !== 1) return;

			tracking = createSwipeTracking(event);
		},
		{ passive: true, signal: options.signal },
	);

	options.surface.addEventListener(
		'touchmove',
		(event) => {
			if (!tracking || event.touches.length !== 1) return;

			const touch = event.touches[0];

			const distanceX = touch.clientX - tracking.startX;

			const distanceY = touch.clientY - tracking.startY;

			const placement = options.placement();

			const vertical = placement === 'bottom' || placement === 'top';

			const canDragVertically = !vertical || canStartVerticalDrag(options.surface, tracking, placement);

			if (vertical && canDragVertically) {
				const closingDistance = getClosingDistance(placement, distanceX, distanceY);

				if (closingDistance > 0 && closingDistance >= Math.abs(distanceX)) event.preventDefault();
			}

			updateSwipeVelocity(tracking, touch, event.timeStamp);

			if (!tracking.dragging && !isSwipeDismissGesture(placement, distanceX, distanceY)) return;

			if (!tracking.dragging) {
				if (!canDragVertically) return;

				tracking.dragging = true;

				tracking.startX = touch.clientX;

				tracking.startY = touch.clientY;

				options.onDragStart?.();

				options.surface.dataset.swiping = 'true';

				event.preventDefault();

				return;
			}

			event.preventDefault();

			const size = getSurfaceSize(options.surface, placement);

			tracking.closingOffset = Math.min(size, Math.max(0, getClosingDistance(placement, distanceX, distanceY)));

			options.onDrag({
				closingOffset: tracking.closingOffset,
				placement,
				progress: getSwipeProgress(tracking.closingOffset, size),
			});
		},
		{ passive: false, signal: options.signal },
	);

	options.surface.addEventListener(
		'touchend',
		(event) => {
			if (tracking?.dragging) event.preventDefault();

			finish(false);
		},
		{ passive: false, signal: options.signal },
	);

	options.surface.addEventListener('touchcancel', () => finish(true), {
		passive: true,
		signal: options.signal,
	});

	options.signal.addEventListener('abort', clickGuard.dispose, { once: true });
};
