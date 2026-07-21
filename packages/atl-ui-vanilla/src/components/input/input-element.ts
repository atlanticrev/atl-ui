import { createTypedEvent, upgradeProperties } from '../../core';

import { INPUT_OBSERVED_ATTRIBUTES, syncInputAttributes } from './input-attributes';
import { replaceInputAccessory, syncInputContent } from './input-content';
import { createInputDom } from './input-dom';
import { bindInputOutline } from './input-outline';
import { createInputPropertiesClass } from './input-properties';
import type { AltInputChangeDetail } from './types';

export const createAltInputElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const InputPropertiesElement = createInputPropertiesClass(HtmlElementConstructor);

	return class AltInputElement extends InputPropertiesElement {
		static observedAttributes = INPUT_OBSERVED_ATTRIBUTES;
		private syncOutline: (() => void) | undefined;

		attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null): void {
			if (name === 'value') {
				this.pendingValue = newValue ?? '';

				if (this.inputDom) {
					this.inputDom.field.defaultValue = this.pendingValue;
					this.inputDom.field.value = this.pendingValue;
				}
			}

			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, [
				'disabled',
				'leadingIcon',
				'readOnly',
				'readOnlyStyled',
				'trailingIcon',
				'value',
				'variant',
			]);
			this.inputDom ??= createInputDom(this);
			this.syncOutline = bindInputOutline(this, this.inputDom, signal);
			const field = this.inputDom.field;
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
			if (!this.inputDom) {
				return;
			}

			this.classList.add('alt-input');
			this.dataset.size = this.getAttribute('size') ?? 'm';
			this.dataset.status = this.getAttribute('status') ?? 'default';
			this.dataset.readonlyStyled = String(this.readOnly || this.readOnlyStyled);
			syncInputAttributes(this, this.inputDom);
			replaceInputAccessory(this.inputDom.leading, this.pendingLeadingIcon);
			replaceInputAccessory(this.inputDom.trailing, this.pendingTrailingIcon);
			syncInputContent(this, this.inputDom, {
				description: this.getAttribute('description') ?? '',
				helperText: this.getAttribute('helper-text') ?? '',
				label: this.getAttribute('label') ?? '',
				showCharacterCount: this.hasAttribute('show-character-count'),
			});
			this.syncOutline?.();
		}

		private handleInput = (): void => {
			this.pendingValue = this.inputDom?.field.value ?? '';
			this.requestUpdate();
			this.dispatchValueEvent('alt-input');
		};

		private handleChange = (): void => {
			this.dispatchValueEvent('alt-change');
		};

		private handleFormReset = (event: Event): void => {
			if (event.target !== this.inputDom?.field.form) {
				return;
			}

			queueMicrotask(() => {
				this.pendingValue = this.inputDom?.field.value ?? '';
				this.requestUpdate();
			});
		};

		private dispatchValueEvent(type: string): void {
			this.dispatchEvent(
				createTypedEvent<AltInputChangeDetail>(type, {
					value: this.value,
				}),
			);
		}
	};
};
