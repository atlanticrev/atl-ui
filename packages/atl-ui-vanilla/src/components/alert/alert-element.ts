import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';
import { syncAltIconContent } from '../../icons';

import { getAlertDefaultIcon, normalizeAlertSeverity, normalizeAlertVariant } from './alert-config';
import { defineAlertContentProperties, getAlertContentState } from './alert-content-properties';
import { type AlertDom, createAlertDom, syncAlertAction } from './alert-dom';
import type { AltAlertCloseDetail, AltAlertCloseReason, AltAlertSeverity, AltAlertVariant } from './types';

export const createAltAlertElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	const AltAlertElement = class extends BaseElement {
		static observedAttributes = ['close-label', 'color', 'dismissible', 'severity', 'variant'];
		#dom: AlertDom | undefined;

		get actionElement(): HTMLElement | null {
			return this.#dom?.action ?? null;
		}
		get color(): AltAlertSeverity {
			return normalizeAlertSeverity(this.getAttribute('color'), this.severity);
		}
		set color(value: AltAlertSeverity) {
			this.setAttribute('color', value);
		}
		get dismissible(): boolean {
			return this.hasAttribute('dismissible');
		}
		set dismissible(value: boolean) {
			this.toggleAttribute('dismissible', value);
		}
		get messageElement(): HTMLElement | null {
			return this.#dom?.message ?? null;
		}
		get severity(): AltAlertSeverity {
			return normalizeAlertSeverity(this.getAttribute('severity'), 'success');
		}
		set severity(value: AltAlertSeverity) {
			this.setAttribute('severity', value);
		}
		get variant(): AltAlertVariant {
			return normalizeAlertVariant(this.getAttribute('variant'));
		}
		set variant(value: AltAlertVariant) {
			this.setAttribute('variant', value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, [
				'action',
				'closeIcon',
				'color',
				'dismissible',
				'icon',
				'iconMapping',
				'severity',
				'variant',
			]);

			this.classList.add('alt-alert');

			if (!this.hasAttribute('role')) this.setAttribute('role', 'alert');

			this.#dom ??= createAlertDom(this);

			const content = getAlertContentState(this);

			if (content.action === undefined && this.#dom.authoredAction) content.action = this.#dom.authoredAction;

			if (content.icon === undefined && this.#dom.authoredIcon) content.icon = this.#dom.authoredIcon;

			this.#dom.closeButton.addEventListener('click', this.#handleClose, { signal });
		}

		close(reason: AltAlertCloseReason = 'programmatic', sourceEvent?: Event): boolean {
			const event = createTypedEvent<AltAlertCloseDetail>(
				'alt-close',
				{ reason, sourceEvent },
				{ cancelable: true },
			);

			if (!this.dispatchEvent(event)) return false;

			this.hidden = true;

			return true;
		}

		show(): void {
			this.hidden = false;
		}

		update(): void {
			if (!this.#dom) return;

			this.dataset.color = this.color;

			this.dataset.severity = this.severity;

			this.dataset.variant = this.variant;

			const content = getAlertContentState(this);

			const mappedIcon = content.iconMapping?.[this.severity];

			const icon = mappedIcon === undefined ? content.icon : mappedIcon;

			syncAltIconContent(this.#dom.icon, icon, getAlertDefaultIcon(this.severity), { size: 20 });

			this.#dom.icon.hidden = icon === null;

			syncAltIconContent(this.#dom.closeButton, content.closeIcon, 'close', { size: 16 });

			this.#dom.closeButton.setAttribute('aria-label', this.getAttribute('close-label') ?? 'Close alert');

			syncAlertAction(this.#dom, content.action, this.dismissible);
		}

		#handleClose = (event: MouseEvent): void => {
			this.close('close-button', event);
		};
	};

	defineAlertContentProperties(AltAlertElement.prototype);

	return AltAlertElement;
};
