import { bindNativeDialog, type NativeDialogController } from '../../controllers/native-dialog';
import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createDialogDom } from './dialog-dom';
import type { AltDialogCloseDetail, AltDialogOpenChangeDetail, AltDialogSize } from './types';

export const createAltDialogElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltDialogElement extends BaseElement {
		static observedAttributes = ['close-on-backdrop', 'open', 'size'];
		#dialog: HTMLDialogElement | undefined;
		#modal: NativeDialogController | undefined;
		#renderedOpen = false;
		#syncing = false;

		get dialogElement(): HTMLDialogElement | null {
			return this.#dialog ?? null;
		}
		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get returnValue(): string {
			return this.#dialog?.returnValue ?? '';
		}
		get size(): AltDialogSize {
			return (Number(this.getAttribute('size')) || 520) as AltDialogSize;
		}
		set size(value: AltDialogSize) {
			this.setAttribute('size', String(value));
		}

		attributeChangedCallback(): void {
			if (!this.#syncing) this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['open', 'size']);

			this.classList.add('alt-dialog-host');

			this.#dialog ??= createDialogDom(this);

			this.#modal = bindNativeDialog(this.#dialog, {
				closeOnBackdrop: () => this.getAttribute('close-on-backdrop') !== 'false',
				closeOnEscape: () => this.getAttribute('close-on-escape') !== 'false',
				onClose: this.#handleNativeClose,
				signal,
			});

			this.#dialog.addEventListener('click', this.#handleClick, { signal });
		}

		showModal(): void {
			this.open = true;
		}
		close(returnValue = ''): void {
			if (this.#modal && this.#dialog?.open) this.#modal.close(returnValue);
			else {
				if (this.#dialog) this.#dialog.returnValue = returnValue;

				this.#setOpen(false);

				this.#dispatchClose();
			}
		}

		update(): void {
			if (!this.#dialog) return;

			this.#dialog.dataset.size = String(this.size);

			if (this.open === this.#dialog.open) return;

			if (this.open) {
				this.#modal?.showModal();
			} else this.#modal?.close();

			this.#dispatchOpenChange(this.open);
		}

		#handleClick = (event: MouseEvent): void => {
			const target = event.target as Element | null;

			const close = target?.closest<HTMLElement>('[data-alt-dialog-close]');

			if (close) this.close(close.dataset.altDialogClose ?? '');
		};
		#handleNativeClose = (): void => {
			this.#setOpen(false);

			this.#dispatchOpenChange(false);

			this.#dispatchClose();
		};
		#dispatchOpenChange(open: boolean): void {
			if (this.#renderedOpen === open) return;

			this.#renderedOpen = open;

			this.dispatchEvent(createTypedEvent<AltDialogOpenChangeDetail>('alt-open-change', { open }));
		}
		#setOpen(open: boolean): void {
			this.#syncing = true;

			this.toggleAttribute('open', open);

			this.#syncing = false;
		}
		#dispatchClose(): void {
			this.dispatchEvent(createTypedEvent<AltDialogCloseDetail>('alt-close', { returnValue: this.returnValue }));
		}
	};
};
