import type { OverlayPlacement } from '../../controllers';
import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { bindPopupOverlay } from './popup-overlay';
import { popupObservedAttributes, popupUpgradeProperties, readPopupBoolean } from './popup-properties';
import type { AltPopupOpenChangeDetail } from './types';

export const createAltPopupElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltPopupElement extends BaseElement {
		static observedAttributes = popupObservedAttributes;
		#anchor: Element | null = null;
		#cleanup: (() => void) | undefined;
		#renderedOpen = false;

		get anchor(): Element | null {
			const id = this.getAttribute('anchor-id');
			return this.#anchor ?? (id ? this.ownerDocument.getElementById(id) : null);
		}
		set anchor(value: Element | null) {
			this.#anchor = value;

			this.requestUpdate();
		}
		get closeOnEscape(): boolean {
			return readPopupBoolean(this, 'close-on-escape', true);
		}
		set closeOnEscape(value: boolean) {
			this.setAttribute('close-on-escape', String(value));
		}
		get closeOnOutsideClick(): boolean {
			return readPopupBoolean(this, 'close-on-outside-click', true);
		}
		set closeOnOutsideClick(value: boolean) {
			this.setAttribute('close-on-outside-click', String(value));
		}
		get flip(): boolean {
			return readPopupBoolean(this, 'flip', true);
		}
		set flip(value: boolean) {
			this.setAttribute('flip', String(value));
		}
		get gap(): number {
			return Number(this.getAttribute('gap')) || 4;
		}
		set gap(value: number) {
			this.setAttribute('gap', String(value));
		}
		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get placement(): OverlayPlacement {
			return (this.getAttribute('placement') as OverlayPlacement) || 'bottom-start';
		}
		set placement(value: OverlayPlacement) {
			this.setAttribute('placement', value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(): void {
			upgradeProperties(this, popupUpgradeProperties);

			this.classList.add('alt-popup');

			this.setAttribute('popover', 'manual');
		}

		onDisconnected(): void {
			this.#cleanupOverlay();
		}

		show(): void {
			this.open = true;
		}
		close(): void {
			this.open = false;
		}
		toggle(): void {
			this.open = !this.open;
		}

		update(): void {
			const signal = this.connectionSignal;

			const anchor = this.anchor;

			this.dataset.open = String(this.open);

			this.hidden = !this.open;

			this.#cleanupOverlay();

			if (this.open && anchor && signal) this.#showOverlay(anchor, signal);

			if (this.#renderedOpen !== this.open) {
				this.#renderedOpen = this.open;

				this.dispatchEvent(createTypedEvent<AltPopupOpenChangeDetail>('alt-open-change', { open: this.open }));
			}
		}

		#showOverlay(anchor: Element, signal: AbortSignal): void {
			this.#cleanup = bindPopupOverlay(this, {
				anchor,
				closeOnEscape: this.closeOnEscape,
				closeOnOutsideClick: this.closeOnOutsideClick,
				flip: this.flip,
				gap: this.gap,
				onDismiss: this.close.bind(this),
				placement: this.placement,
				signal,
			});
		}

		#cleanupOverlay(): void {
			this.#cleanup?.();

			this.#cleanup = undefined;
		}
	};
};
