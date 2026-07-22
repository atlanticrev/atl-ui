import { captureFocus, type FocusRestorer } from '../../controllers';
import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createDialogDom } from './dialog-dom';
import type { AltDialogCloseDetail, AltDialogOpenChangeDetail, AltDialogSize } from './types';

export const createAltDialogElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltDialogElement extends BaseElement {
		static observedAttributes = ['close-on-backdrop', 'open', 'size'];
		#dialog: HTMLDialogElement | undefined;
		#focusRestorer: FocusRestorer | undefined;
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

			this.#dialog.addEventListener('cancel', this.#handleCancel, { signal });

			this.#dialog.addEventListener('click', this.#handleClick, { signal });

			this.#dialog.addEventListener('close', this.#handleNativeClose, { signal });
		}

		showModal(): void {
			this.open = true;
		}
		close(returnValue = ''): void {
			if (this.#dialog?.open && typeof this.#dialog.close === 'function') this.#dialog.close(returnValue);
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
				this.#focusRestorer = captureFocus(this.ownerDocument);

				if (typeof this.#dialog.showModal === 'function') this.#dialog.showModal();
				else this.#dialog.setAttribute('open', '');
			} else if (typeof this.#dialog.close === 'function') this.#dialog.close();
			else this.#dialog.removeAttribute('open');

			this.#dispatchOpenChange(this.open);
		}

		#handleCancel = (event: Event): void => {
			if (this.getAttribute('close-on-escape') === 'false') event.preventDefault();
		};
		#handleClick = (event: MouseEvent): void => {
			const target = event.target as Element | null;

			const close = target?.closest<HTMLElement>('[data-alt-dialog-close]');

			if (close) this.close(close.dataset.altDialogClose ?? '');
			else if (target === this.#dialog && this.getAttribute('close-on-backdrop') !== 'false') this.close();
		};
		#handleNativeClose = (): void => {
			this.#setOpen(false);

			this.#focusRestorer?.restore();

			this.#focusRestorer = undefined;

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
