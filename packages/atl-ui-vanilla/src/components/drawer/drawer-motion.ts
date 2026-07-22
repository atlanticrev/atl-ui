import { animateSwipeSettle } from '../../controllers/swipe-dismiss-animation';
import type { SwipeDismissPlacement } from '../../controllers/swipe-dismiss-gesture';

export const getDrawerTransform = (placement: SwipeDismissPlacement, closingOffset: number): string => {
	if (placement === 'left') return `translate3d(${-closingOffset}px, 0, 0)`;

	if (placement === 'right') return `translate3d(${closingOffset}px, 0, 0)`;

	if (placement === 'top') return `translate3d(0, ${-closingOffset}px, 0)`;

	return `translate3d(0, ${closingOffset}px, 0)`;
};

const getDrawerSize = (dialog: HTMLDialogElement, placement: SwipeDismissPlacement): number => {
	return placement === 'left' || placement === 'right' ? dialog.offsetWidth : dialog.offsetHeight;
};

const getDrawerHiddenTransform = (placement: SwipeDismissPlacement): string => {
	if (placement === 'left') return 'translate3d(-100%, 0, 0)';

	if (placement === 'right') return 'translate3d(100%, 0, 0)';

	if (placement === 'top') return 'translate3d(0, -100%, 0)';

	return 'translate3d(0, 100%, 0)';
};

export const setDrawerDrag = (
	dialog: HTMLDialogElement,
	placement: SwipeDismissPlacement,
	closingOffset: number,
	progress: number,
): void => {
	dialog.style.transform = getDrawerTransform(placement, closingOffset);

	dialog.style.setProperty('--alt-drawer-backdrop-progress', String(progress));
};

export const prepareDrawerOpen = (dialog: HTMLDialogElement, placement: SwipeDismissPlacement): void => {
	dialog.dataset.swiping = 'true';

	dialog.style.visibility = 'hidden';

	dialog.style.transform = getDrawerHiddenTransform(placement);

	dialog.style.setProperty('--alt-drawer-backdrop-progress', '0');

	void dialog.offsetWidth;
};

export const clearDrawerMotion = (dialog: HTMLDialogElement): void => {
	delete dialog.dataset.swiping;

	dialog.style.removeProperty('--alt-drawer-snap-duration');

	dialog.style.removeProperty('--alt-drawer-backdrop-progress');

	dialog.style.removeProperty('transform');

	dialog.style.removeProperty('visibility');
};

type DrawerAnimationOptions = {
	duration: number;
	onComplete: () => void;
	open: boolean;
	placement: SwipeDismissPlacement;
	waitForPaint?: boolean;
};

export const animateDrawer = (dialog: HTMLDialogElement, options: DrawerAnimationOptions): (() => void) => {
	return animateSwipeSettle(dialog, {
		duration: options.duration,
		durationProperty: '--alt-drawer-snap-duration',
		onReady: () => {
			if (options.open) dialog.style.removeProperty('visibility');
		},
		onComplete: options.onComplete,
		onTarget: () => {
			const closingOffset = options.open ? 0 : getDrawerSize(dialog, options.placement);

			setDrawerDrag(dialog, options.placement, closingOffset, options.open ? 1 : 0);
		},
		waitForPaint: options.waitForPaint,
	});
};
