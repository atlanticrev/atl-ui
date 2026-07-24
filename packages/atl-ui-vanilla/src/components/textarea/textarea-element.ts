import { createTypedEvent, upgradeProperties } from '../../core';

import { syncTextareaAttributes, TEXTAREA_OBSERVED_ATTRIBUTES } from './textarea-attributes';
import { syncTextareaContent } from './textarea-content';
import { createTextareaDom } from './textarea-dom';
import { bindTextareaOutline } from './textarea-outline';
import { createTextareaPropertiesClass } from './textarea-properties';
import type { AltTextareaChangeDetail } from './types';

export const createAltTextareaElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const TextareaPropertiesElement = createTextareaPropertiesClass(HtmlElementConstructor);

	return class AltTextareaElement extends TextareaPropertiesElement {
		static observedAttributes = TEXTAREA_OBSERVED_ATTRIBUTES;
		private syncOutline: (() => void) | undefined;

		attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
			if (name === 'value') {
				this.pendingValue = newValue ?? '';

				if (this.textareaDom) {
					this.textareaDom.field.defaultValue = this.pendingValue;

					this.textareaDom.field.value = this.pendingValue;
				}
			}

			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['disabled', 'readOnly', 'readOnlyStyled', 'value']);

			this.textareaDom ??= createTextareaDom(this);

			this.syncOutline = bindTextareaOutline(this, this.textareaDom, signal);

			const field = this.textareaDom.field;

			field.value = this.pendingValue ?? this.getAttribute('value') ?? '';

			field.defaultValue = this.getAttribute('value') ?? '';

			field.addEventListener('input', this.handleInput, {
				signal,
			});

			field.addEventListener('change', this.handleChange, {
				signal,
			});

			this.ownerDocument.addEventListener('reset', this.handleFormReset, {
				signal,
			});
		}

		update(): void {
			if (!this.textareaDom) {
				return;
			}

			this.classList.add('alt-textarea');

			this.dataset.size = this.getAttribute('size') ?? 'm';

			this.dataset.status = this.getAttribute('status') ?? 'default';

			this.dataset.readonlyStyled = String(this.readOnly || this.readOnlyStyled);

			syncTextareaAttributes(this, this.textareaDom);

			syncTextareaContent(this, this.textareaDom, {
				description: this.getAttribute('description') ?? '',
				helperText: this.getAttribute('helper-text') ?? '',
				label: this.getAttribute('label') ?? '',
				showCharacterCount: this.hasAttribute('show-character-count'),
			});

			this.syncOutline?.();
		}

		private handleInput = (): void => {
			this.pendingValue = this.textareaDom?.field.value ?? '';

			this.requestUpdate();

			this.dispatchValueEvent('alt-input');
		};

		private handleChange = (): void => {
			this.dispatchValueEvent('alt-change');
		};

		private handleFormReset = (event: Event): void => {
			if (event.target !== this.textareaDom?.field.form) {
				return;
			}

			queueMicrotask(() => {
				this.pendingValue = this.textareaDom?.field.value ?? '';

				this.requestUpdate();
			});
		};

		private dispatchValueEvent(type: string): void {
			this.dispatchEvent(
				createTypedEvent<AltTextareaChangeDetail>(type, {
					value: this.value,
				}),
			);
		}
	};
};
