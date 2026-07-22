import { createBaseElementClass, createTypedEvent, upgradeProperty } from '../../core';

import { createSearchDom, type SearchDom } from './search-dom';
import type { AltSearchChangeDetail } from './types';

const FORWARDED_ATTRIBUTES = ['autocomplete', 'disabled', 'form', 'name', 'placeholder', 'required'] as const;

export const createAltSearchElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltSearchElement extends BaseElement {
		static observedAttributes = ['aria-label', ...FORWARDED_ATTRIBUTES, 'value'];
		#dom: SearchDom | undefined;
		#pendingValue = '';

		get value(): string {
			return this.#dom?.field.value ?? (this.#pendingValue || this.getAttribute('value') || '');
		}
		set value(value: string) {
			this.#pendingValue = value;

			this.setAttribute('value', value);

			if (this.#dom) this.#dom.field.value = value;
		}

		attributeChangedCallback(name: string, _oldValue: string | null, value: string | null): void {
			if (name === 'value') this.#pendingValue = value ?? '';

			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperty(this, 'value');

			this.classList.add('alt-search');

			this.#dom ??= createSearchDom(this);

			this.#dom.field.value = this.#pendingValue || this.getAttribute('value') || '';

			this.#dom.field.defaultValue = this.getAttribute('value') || '';

			this.#dom.field.addEventListener('input', this.#handleInput, { signal });

			this.#dom.field.addEventListener('change', this.#handleChange, { signal });

			this.#dom.clear.addEventListener('click', this.#clear, { signal });

			this.ownerDocument.addEventListener('reset', this.#handleReset, { signal });
		}

		focus(options?: FocusOptions): void {
			this.#dom?.field.focus(options);
		}

		update(): void {
			if (!this.#dom) return;

			for (const name of FORWARDED_ATTRIBUTES) {
				const value = this.getAttribute(name);

				value === null ? this.#dom.field.removeAttribute(name) : this.#dom.field.setAttribute(name, value);
			}

			this.#dom.field.setAttribute('aria-label', this.getAttribute('aria-label') || 'Search');

			this.#dom.clear.hidden = !this.value || this.#dom.field.disabled;
		}

		#emit(type: string): void {
			this.dispatchEvent(createTypedEvent<AltSearchChangeDetail>(type, { value: this.value }));
		}
		#handleInput = (): void => {
			this.#pendingValue = this.#dom?.field.value ?? '';

			this.requestUpdate();

			this.#emit('alt-input');
		};

		#handleChange = (): void => {
			this.#emit('alt-change');
		};
		#clear = (): void => {
			if (!this.#dom) return;

			this.#dom.field.value = '';

			this.#pendingValue = '';

			this.requestUpdate();

			this.#emit('alt-input');

			this.#emit('alt-change');

			this.#dom.field.focus();
		};

		#handleReset = (event: Event): void => {
			if (event.target !== this.#dom?.field.form) return;

			queueMicrotask(() => {
				this.#pendingValue = this.#dom?.field.value ?? '';

				this.requestUpdate();
			});
		};
	};
};
