import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { type AvatarDom, createAvatarDom, normalizeInitials } from './avatar-dom';
import type { AltAvatarErrorDetail, AltAvatarShape } from './types';

export const createAltAvatarElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltAvatarElement extends BaseElement {
		static observedAttributes = ['alt', 'initials', 'shape', 'size', 'src'];
		#dom: AvatarDom | undefined;
		#failedSource = '';
		#icon: Node | null = null;
		#loading = false;

		get alt(): string {
			return this.getAttribute('alt') ?? '';
		}
		set alt(value: string) {
			this.setAttribute('alt', value);
		}
		get initials(): string {
			return this.getAttribute('initials') ?? '';
		}
		set initials(value: string) {
			this.setAttribute('initials', value);
		}
		get shape(): AltAvatarShape {
			return this.getAttribute('shape') === 'square' ? 'square' : 'circle';
		}
		set shape(value: AltAvatarShape) {
			this.setAttribute('shape', value);
		}
		get size(): number {
			return Number(this.getAttribute('size')) || 32;
		}
		set size(value: number) {
			this.setAttribute('size', String(value));
		}
		get src(): string {
			return this.getAttribute('src') ?? '';
		}
		set src(value: string) {
			this.setAttribute('src', value);
		}
		get icon(): Node | null {
			return this.#icon;
		}
		set icon(value: Node | null) {
			this.#icon = value;

			this.requestUpdate();
		}

		attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
			if (name === 'src' && previous !== value) {
				this.#failedSource = '';

				this.#loading = Boolean(value);
			}

			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['alt', 'icon', 'initials', 'shape', 'size', 'src']);

			this.classList.add('alt-avatar');

			this.#dom ??= createAvatarDom(this);

			this.#dom.image.addEventListener('load', this.#handleLoad, { signal });

			this.#dom.image.addEventListener('error', this.#handleError, { signal });
		}

		update(): void {
			if (!this.#dom) return;

			const showIcon = Boolean(this.#icon);

			const showImage = !showIcon && Boolean(this.src) && this.#failedSource !== this.src;

			this.dataset.shape = this.shape;

			this.style.setProperty('--alt-avatar-size', `${Math.max(1, this.size)}px`);

			this.#dom.image.hidden = !showImage;

			this.#dom.image.alt = this.alt;

			if (showImage && this.#dom.image.src !== this.src) this.#dom.image.src = this.src;

			this.#dom.icon.hidden = !showIcon;

			if (showIcon && this.#icon && this.#dom.icon.firstChild !== this.#icon) {
				this.#dom.icon.replaceChildren(this.#icon);
			}

			this.#dom.initials.hidden = showImage || showIcon;

			this.#dom.initials.textContent = normalizeInitials(this.initials);

			this.#dom.loader.hidden = !showImage || !this.#loading;
		}

		#handleLoad = (): void => {
			this.#loading = false;

			this.requestUpdate();
		};
		#handleError = (): void => {
			this.#failedSource = this.src;

			this.#loading = false;

			this.dispatchEvent(createTypedEvent<AltAvatarErrorDetail>('alt-error', { source: this.src }));

			this.requestUpdate();
		};
	};
};
