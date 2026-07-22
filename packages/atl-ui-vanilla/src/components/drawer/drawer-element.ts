import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { DrawerController } from './drawer-controller';
import { createDrawerDom, syncDrawerAccessibility } from './drawer-dom';
import type {
	AltDrawerCloseDetail,
	AltDrawerCloseReason,
	AltDrawerOpenChangeDetail,
	AltDrawerPlacement,
} from './types';

const PLACEMENTS = new Set<AltDrawerPlacement>(['bottom', 'left', 'right', 'top']);

const readBoolean = (host: HTMLElement, name: string): boolean => {
	return !host.hasAttribute(name) || host.getAttribute(name) !== 'false';
};

export const createAltDrawerElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltDrawerElement extends BaseElement {
		static observedAttributes = [
			'close-on-backdrop',
			'close-on-escape',
			'described-by',
			'label',
			'labelled-by',
			'open',
			'placement',
			'swipe-to-close',
		];
		#controller: DrawerController | undefined;
		#dialog: HTMLDialogElement | undefined;
		#syncing = false;

		get closeOnBackdrop(): boolean {
			return readBoolean(this, 'close-on-backdrop');
		}
		set closeOnBackdrop(value: boolean) {
			this.setAttribute('close-on-backdrop', String(value));
		}
		get closeOnEscape(): boolean {
			return readBoolean(this, 'close-on-escape');
		}
		set closeOnEscape(value: boolean) {
			this.setAttribute('close-on-escape', String(value));
		}
		get dialogElement(): HTMLDialogElement | null {
			return this.#dialog ?? null;
		}
		get label(): string {
			return this.getAttribute('label') ?? '';
		}
		set label(value: string) {
			this.setAttribute('label', value);
		}
		get labelledBy(): string {
			return this.getAttribute('labelled-by') ?? '';
		}
		set labelledBy(value: string) {
			this.setAttribute('labelled-by', value);
		}
		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get placement(): AltDrawerPlacement {
			const value = this.getAttribute('placement') as AltDrawerPlacement | null;

			return value && PLACEMENTS.has(value) ? value : 'left';
		}
		set placement(value: AltDrawerPlacement) {
			this.setAttribute('placement', value);
		}
		get returnValue(): string {
			return this.#dialog?.returnValue ?? '';
		}
		get swipeToClose(): boolean {
			return readBoolean(this, 'swipe-to-close');
		}
		set swipeToClose(value: boolean) {
			this.setAttribute('swipe-to-close', String(value));
		}

		attributeChangedCallback(): void {
			if (!this.#syncing) this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, [
				'closeOnBackdrop',
				'closeOnEscape',
				'label',
				'labelledBy',
				'open',
				'placement',
				'swipeToClose',
			]);

			this.classList.add('alt-drawer-host');

			this.#dialog ??= createDrawerDom(this);

			this.#controller = new DrawerController(
				this.#dialog,
				{
					closeOnBackdrop: () => this.closeOnBackdrop,
					closeOnEscape: () => this.closeOnEscape,
					onClose: this.#dispatchClose,
					onOpenChange: this.#dispatchOpenChange,
					open: () => this.open,
					placement: () => this.placement,
					setOpen: this.#setOpen,
					swipeToClose: () => this.swipeToClose,
				},
				signal,
			);
		}

		onDisconnected(): void {
			this.#controller?.destroy();

			this.#controller = undefined;
		}

		showModal(): void {
			this.open = true;
		}
		close(returnValue = ''): void {
			this.#controller?.close('programmatic', returnValue);
		}

		update(): void {
			if (!this.#dialog) return;

			this.#dialog.dataset.placement = this.placement;

			syncDrawerAccessibility(this, this.#dialog);

			this.#controller?.sync();
		}

		#dispatchClose = (detail: AltDrawerCloseDetail): void => {
			this.dispatchEvent(createTypedEvent<AltDrawerCloseDetail>('alt-close', detail));
		};

		#dispatchOpenChange = (open: boolean, reason: AltDrawerCloseReason): void => {
			this.dispatchEvent(createTypedEvent<AltDrawerOpenChangeDetail>('alt-open-change', { open, reason }));
		};

		#setOpen = (open: boolean): void => {
			this.#syncing = true;

			this.toggleAttribute('open', open);

			this.#syncing = false;
		};
	};
};
