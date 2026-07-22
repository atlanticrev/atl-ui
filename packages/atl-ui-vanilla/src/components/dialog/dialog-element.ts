import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { DialogController } from './dialog-controller';
import { createDialogDom } from './dialog-dom';
import type { AltDialogCloseDetail, AltDialogOpenChangeDetail, AltDialogSize } from './types';

export const createAltDialogElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltDialogElement extends BaseElement {
		static observedAttributes = ['close-on-backdrop', 'open', 'size'];
		#controller: DialogController | undefined;
		#dialog: HTMLDialogElement | undefined;
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

			this.#controller = new DialogController(
				this.#dialog,
				{
					closeOnBackdrop: () => this.getAttribute('close-on-backdrop') !== 'false',
					closeOnEscape: () => this.getAttribute('close-on-escape') !== 'false',
					onClose: this.#dispatchClose,
					onOpenChange: this.#dispatchOpenChange,
					open: () => this.open,
					setOpen: this.#setOpen,
				},
				signal,
			);

			this.#dialog.addEventListener('click', this.#handleClick, { signal });
		}

		onDisconnected(): void {
			this.#controller?.destroy();

			this.#controller = undefined;
		}

		showModal(): void {
			this.open = true;
		}
		close(returnValue = ''): void {
			if (this.#controller && this.#dialog?.open) this.#controller.close(returnValue);
			else {
				if (this.#dialog) this.#dialog.returnValue = returnValue;

				this.#setOpen(false);

				this.#dispatchClose(returnValue);
			}
		}

		update(): void {
			if (!this.#dialog) return;

			this.#dialog.dataset.size = String(this.size);

			this.#controller?.sync();
		}

		#handleClick = (event: MouseEvent): void => {
			const target = event.target as Element | null;

			const close = target?.closest<HTMLElement>('[data-alt-dialog-close]');

			if (close) this.close(close.dataset.altDialogClose ?? '');
		};
		#dispatchOpenChange = (open: boolean): void => {
			if (this.#renderedOpen === open) return;

			this.#renderedOpen = open;

			this.dispatchEvent(createTypedEvent<AltDialogOpenChangeDetail>('alt-open-change', { open }));
		};
		#setOpen = (open: boolean): void => {
			this.#syncing = true;

			this.toggleAttribute('open', open);

			this.#syncing = false;
		};
		#dispatchClose = (returnValue = this.returnValue): void => {
			this.dispatchEvent(createTypedEvent<AltDialogCloseDetail>('alt-close', { returnValue }));
		};
	};
};
