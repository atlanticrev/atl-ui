import { bindNativeDialog, type NativeDialogController } from '../../controllers/native-dialog';

import { animateDialog, clearDialogMotion, prepareDialogOpen } from './dialog-motion';

type DialogPhase = 'closed' | 'closing' | 'open' | 'opening';

type DialogControllerOptions = {
	closeOnBackdrop: () => boolean;
	closeOnEscape: () => boolean;
	onClose: (returnValue: string) => void;
	onOpenChange: (open: boolean) => void;
	open: () => boolean;
	setOpen: (open: boolean) => void;
};

export class DialogController {
	#animationCancel: (() => void) | undefined;
	#modal: NativeDialogController;
	#pendingReturnValue: string | undefined;
	#phase: DialogPhase = 'closed';

	constructor(
		private readonly dialog: HTMLDialogElement,
		private readonly options: DialogControllerOptions,
		signal: AbortSignal,
	) {
		this.#modal = bindNativeDialog(dialog, {
			closeOnBackdrop: options.closeOnBackdrop,
			closeOnEscape: options.closeOnEscape,
			onClose: this.#handleNativeClose,
			onDismissRequest: () => this.close(),
			signal,
		});
	}

	close(returnValue = ''): void {
		if (!this.dialog.open || this.#phase === 'closing') return;

		this.#phase = 'closing';

		this.#pendingReturnValue = returnValue;

		this.options.setOpen(false);

		this.options.onOpenChange(false);

		this.#cancelAnimation();

		this.#animationCancel = animateDialog(this.dialog, {
			onComplete: () => this.#modal.close(returnValue),
			open: false,
		});
	}

	destroy(): void {
		this.#cancelAnimation();

		if (this.dialog.open && typeof this.dialog.close === 'function') this.dialog.close();

		clearDialogMotion(this.dialog);

		this.dialog.dataset.state = 'closed';

		this.#phase = 'closed';
	}

	sync(): void {
		if (this.options.open() && this.#phase === 'closed') this.#open();
		else if (this.options.open() && this.#phase === 'closing') this.#settleOpen();
		else if (!this.options.open() && (this.#phase === 'open' || this.#phase === 'opening')) this.close();
	}

	#cancelAnimation(): void {
		this.#animationCancel?.();

		this.#animationCancel = undefined;
	}

	#handleNativeClose = (): void => {
		const returnValue = this.#pendingReturnValue ?? this.dialog.returnValue;

		this.#cancelAnimation();

		clearDialogMotion(this.dialog);

		this.dialog.dataset.state = 'closed';

		this.#phase = 'closed';

		this.options.setOpen(false);

		this.options.onOpenChange(false);

		this.options.onClose(returnValue);

		this.#pendingReturnValue = undefined;
	};

	#open(): void {
		this.#phase = 'opening';

		prepareDialogOpen(this.dialog);

		this.#modal.showModal();

		this.#settleOpen(true);
	}

	#settleOpen(waitForPaint = false): void {
		this.#phase = 'opening';

		this.#pendingReturnValue = undefined;

		this.#cancelAnimation();

		this.#animationCancel = animateDialog(this.dialog, {
			onComplete: () => {
				clearDialogMotion(this.dialog);

				this.#phase = 'open';
			},
			open: true,
			waitForPaint,
		});

		this.options.onOpenChange(true);
	}
}
