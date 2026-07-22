import { createBaseElementClass } from '../../core';

import type { InputDom } from './input-dom';
import type { InputPropertiesConstructor } from './input-properties-types';
import type { AltInputVariant } from './types';

export const createInputPropertiesClass = (HtmlElementConstructor: typeof HTMLElement): InputPropertiesConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class InputPropertiesElement extends BaseElement {
		inputDom: InputDom | undefined;
		pendingValue: string | undefined;
		pendingLeadingIcon: Node | null = null;
		pendingTrailingIcon: Node | null = null;

		get disabled(): boolean {
			return this.hasAttribute('disabled');
		}

		set disabled(value: boolean) {
			this.toggleAttribute('disabled', value);
		}

		get form(): HTMLFormElement | null {
			return this.inputDom?.field.form ?? null;
		}

		get inputElement(): HTMLInputElement | null {
			return this.inputDom?.field ?? null;
		}

		get leadingIcon(): Node | null {
			return this.pendingLeadingIcon;
		}

		set leadingIcon(value: Node | null) {
			this.pendingLeadingIcon = value;

			this.requestUpdate();
		}

		get readOnly(): boolean {
			return this.hasAttribute('readonly');
		}

		set readOnly(value: boolean) {
			this.toggleAttribute('readonly', value);
		}

		get readOnlyStyled(): boolean {
			return this.hasAttribute('read-only-styled');
		}

		set readOnlyStyled(value: boolean) {
			this.toggleAttribute('read-only-styled', value);
		}

		get trailingIcon(): Node | null {
			return this.pendingTrailingIcon;
		}

		set trailingIcon(value: Node | null) {
			this.pendingTrailingIcon = value;

			this.requestUpdate();
		}

		get validationMessage(): string {
			return this.inputDom?.field.validationMessage ?? '';
		}

		get validity(): ValidityState | null {
			return this.inputDom?.field.validity ?? null;
		}

		get value(): string {
			return this.inputDom?.field.value ?? this.pendingValue ?? this.getAttribute('value') ?? '';
		}

		set value(value: string) {
			this.pendingValue = String(value);

			if (this.inputDom) {
				this.inputDom.field.value = this.pendingValue;
			}

			this.requestUpdate();
		}

		get variant(): AltInputVariant {
			return this.getAttribute('variant') === 'number' ? 'number' : 'text';
		}

		set variant(value: AltInputVariant) {
			this.setAttribute('variant', value);
		}

		checkValidity(): boolean {
			return this.inputDom?.field.checkValidity() ?? true;
		}

		focus(options?: FocusOptions): void {
			this.inputDom?.field.focus(options);
		}

		reportValidity(): boolean {
			return this.inputDom?.field.reportValidity() ?? true;
		}

		select(): void {
			this.inputDom?.field.select();
		}

		setCustomValidity(message: string): void {
			this.inputDom?.field.setCustomValidity(message);
		}
	};
};
