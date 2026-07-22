import { bindNativeDialog, type NativeDialogController } from '../../controllers/native-dialog';
import { SWIPE_SNAP_DURATION } from '../../controllers/swipe-dismiss-gesture';

import { bindDrawerInteractions } from './drawer-interactions';
import { animateDrawer, clearDrawerMotion, prepareDrawerOpen } from './drawer-motion';
import type { AltDrawerCloseDetail, AltDrawerCloseReason, AltDrawerPlacement } from './types';

type DrawerPhase = 'closed' | 'closing' | 'open' | 'opening';

type DrawerControllerOptions = {
	closeOnBackdrop: () => boolean;
	closeOnEscape: () => boolean;
	onClose: (detail: AltDrawerCloseDetail) => void;
	onOpenChange: (open: boolean, reason: AltDrawerCloseReason) => void;
	open: () => boolean;
	placement: () => AltDrawerPlacement;
	setOpen: (open: boolean) => void;
	swipeToClose: () => boolean;
};

export class DrawerController {
	#animationCancel: (() => void) | undefined;
	#modal: NativeDialogController;
	#pendingClose: AltDrawerCloseDetail | undefined;
	#phase: DrawerPhase = 'closed';
	#renderedOpen = false;

	constructor(
		private readonly dialog: HTMLDialogElement,
		private readonly options: DrawerControllerOptions,
		signal: AbortSignal,
	) {
		this.#modal = bindNativeDialog(dialog, {
			closeOnBackdrop: options.closeOnBackdrop,
			closeOnEscape: options.closeOnEscape,
			onClose: this.#handleNativeClose,
			onDismissRequest: (reason) => this.close(reason),
			signal,
		});

		bindDrawerInteractions({
			dialog,
			enabled: () => dialog.open && options.open() && options.swipeToClose() && this.#phase !== 'closing',
			onAction: (returnValue) => this.close('action', returnValue),
			onDragStart: () => {
				this.#cancelAnimation();

				this.#phase = 'open';
			},
			onSettle: (detail) => {
				if (detail.dismiss) this.close('gesture', '', detail.duration);
				else this.#settleOpen(detail.duration);
			},
			placement: options.placement,
			signal,
		});
	}

	close(reason: AltDrawerCloseReason, returnValue = '', duration = SWIPE_SNAP_DURATION): void {
		if (!this.dialog.open || this.#phase === 'closing') return;

		this.#phase = 'closing';

		this.#pendingClose = { reason, returnValue };

		this.options.setOpen(false);

		this.#dispatchOpenChange(false, reason);

		this.#cancelAnimation();

		this.#animationCancel = animateDrawer(this.dialog, {
			duration,
			onComplete: () => this.#modal.close(returnValue),
			open: false,
			placement: this.options.placement(),
		});
	}

	destroy(): void {
		this.#cancelAnimation();

		if (this.dialog.open && typeof this.dialog.close === 'function') this.dialog.close();

		clearDrawerMotion(this.dialog);

		this.#phase = 'closed';

		this.#renderedOpen = false;
	}

	sync(): void {
		if (this.options.open() && this.#phase === 'closed') this.#open();
		else if (this.options.open() && this.#phase === 'closing') this.#settleOpen(SWIPE_SNAP_DURATION);
		else if (!this.options.open() && (this.#phase === 'open' || this.#phase === 'opening')) {
			this.close('programmatic');
		}
	}

	#cancelAnimation(): void {
		this.#animationCancel?.();

		this.#animationCancel = undefined;
	}

	#dispatchOpenChange(open: boolean, reason: AltDrawerCloseReason): void {
		if (this.#renderedOpen === open) return;

		this.#renderedOpen = open;

		this.options.onOpenChange(open, reason);
	}

	#handleNativeClose = (): void => {
		const detail = this.#pendingClose ?? {
			reason: 'programmatic' as const,
			returnValue: this.dialog.returnValue,
		};

		this.#cancelAnimation();

		clearDrawerMotion(this.dialog);

		this.dialog.dataset.state = 'closed';

		this.#phase = 'closed';

		this.options.setOpen(false);

		this.#dispatchOpenChange(false, detail.reason);

		this.options.onClose(detail);

		this.#pendingClose = undefined;
	};

	#open(): void {
		this.#phase = 'opening';

		this.dialog.dataset.state = 'open';

		this.#modal.showModal();

		prepareDrawerOpen(this.dialog, this.options.placement());

		this.#settleOpen(SWIPE_SNAP_DURATION, true);

		this.#dispatchOpenChange(true, 'programmatic');
	}

	#settleOpen(duration: number, waitForPaint = false): void {
		this.#phase = 'opening';

		this.#cancelAnimation();

		this.#animationCancel = animateDrawer(this.dialog, {
			duration,
			onComplete: () => {
				clearDrawerMotion(this.dialog);

				this.#phase = 'open';
			},
			open: true,
			placement: this.options.placement(),
			waitForPaint,
		});

		this.#dispatchOpenChange(true, 'programmatic');
	}
}
