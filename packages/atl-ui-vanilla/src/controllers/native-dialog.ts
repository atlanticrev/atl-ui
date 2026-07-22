import { captureFocus, type FocusRestorer } from './focus';

export type NativeDialogDismissReason = 'backdrop' | 'escape';

export type NativeDialogController = {
	close: (returnValue?: string) => void;
	showModal: () => void;
};

type NativeDialogOptions = {
	closeOnBackdrop: () => boolean;
	closeOnEscape: () => boolean;
	onClose: () => void;
	onDismissRequest?: (reason: NativeDialogDismissReason, sourceEvent: Event) => void;
	signal: AbortSignal;
};

const isBackdropClick = (dialog: HTMLDialogElement, event: MouseEvent): boolean => {
	const bounds = dialog.getBoundingClientRect();

	return (
		event.clientX < bounds.left ||
		event.clientX > bounds.right ||
		event.clientY < bounds.top ||
		event.clientY > bounds.bottom
	);
};

export const bindNativeDialog = (dialog: HTMLDialogElement, options: NativeDialogOptions): NativeDialogController => {
	let focusRestorer: FocusRestorer | undefined;

	const restoreFocus = (): void => {
		focusRestorer?.restore();

		focusRestorer = undefined;
	};

	const handleClose = (): void => {
		restoreFocus();

		options.onClose();
	};

	const close = (returnValue = ''): void => {
		if (dialog.open && typeof dialog.close === 'function') {
			dialog.close(returnValue);

			return;
		}

		dialog.returnValue = returnValue;

		dialog.removeAttribute('open');

		handleClose();
	};

	const requestDismiss = (reason: NativeDialogDismissReason, event: Event): void => {
		if (options.onDismissRequest) options.onDismissRequest(reason, event);
		else close();
	};

	dialog.addEventListener(
		'cancel',
		(event) => {
			if (!options.closeOnEscape()) {
				event.preventDefault();

				return;
			}

			if (options.onDismissRequest) {
				event.preventDefault();

				requestDismiss('escape', event);
			}
		},
		{ signal: options.signal },
	);

	dialog.addEventListener(
		'click',
		(event) => {
			if (options.closeOnBackdrop() && isBackdropClick(dialog, event)) {
				requestDismiss('backdrop', event);
			}
		},
		{ signal: options.signal },
	);

	dialog.addEventListener('close', handleClose, { signal: options.signal });

	options.signal.addEventListener('abort', restoreFocus, { once: true });

	return {
		close,
		showModal: () => {
			if (dialog.open) return;

			focusRestorer = captureFocus(dialog.ownerDocument);

			if (typeof dialog.showModal === 'function') dialog.showModal();
			else dialog.setAttribute('open', '');
		},
	};
};
