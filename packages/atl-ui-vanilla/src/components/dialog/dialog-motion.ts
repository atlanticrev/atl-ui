import { animateSwipeSettle } from '../../controllers/swipe-dismiss-animation';

export const DIALOG_MOTION_DURATION = 250;

export const prepareDialogOpen = (dialog: HTMLDialogElement): void => {
	dialog.dataset.state = 'closed';

	dialog.style.visibility = 'hidden';

	dialog.style.setProperty('--alt-dialog-backdrop-progress', '0');

	void dialog.offsetWidth;
};

export const clearDialogMotion = (dialog: HTMLDialogElement): void => {
	dialog.style.removeProperty('--alt-dialog-motion-duration');

	dialog.style.removeProperty('--alt-dialog-backdrop-progress');

	dialog.style.removeProperty('visibility');
};

type DialogAnimationOptions = {
	onComplete: () => void;
	open: boolean;
	waitForPaint?: boolean;
};

export const animateDialog = (dialog: HTMLDialogElement, options: DialogAnimationOptions): (() => void) => {
	return animateSwipeSettle(dialog, {
		duration: DIALOG_MOTION_DURATION,
		durationProperty: '--alt-dialog-motion-duration',
		onReady: () => {
			if (options.open) dialog.style.removeProperty('visibility');
		},
		onComplete: options.onComplete,
		onTarget: () => {
			dialog.dataset.state = options.open ? 'open' : 'closed';

			dialog.style.setProperty('--alt-dialog-backdrop-progress', options.open ? '1' : '0');
		},
		waitForPaint: options.waitForPaint,
	});
};
