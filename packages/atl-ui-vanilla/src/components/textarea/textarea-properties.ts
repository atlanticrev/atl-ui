import { createBaseElementClass } from '../../core';

import type { TextareaDom } from './textarea-dom';
import type { TextareaPropertiesConstructor } from './textarea-properties-types';

export const createTextareaPropertiesClass = (
	HtmlElementConstructor: typeof HTMLElement,
): TextareaPropertiesConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class TextareaPropertiesElement extends BaseElement {
		textareaDom: TextareaDom | undefined;
		pendingValue: string | undefined;

		get disabled(): boolean {
			return this.hasAttribute('disabled');
		}

		set disabled(value: boolean) {
			this.toggleAttribute('disabled', value);
		}

		get form(): HTMLFormElement | null {
			return this.textareaDom?.field.form ?? null;
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

		get textareaElement(): HTMLTextAreaElement | null {
			return this.textareaDom?.field ?? null;
		}

		get validationMessage(): string {
			return this.textareaDom?.field.validationMessage ?? '';
		}

		get validity(): ValidityState | null {
			return this.textareaDom?.field.validity ?? null;
		}

		get value(): string {
			return this.textareaDom?.field.value ?? this.pendingValue ?? this.getAttribute('value') ?? '';
		}

		set value(value: string) {
			this.pendingValue = String(value);

			if (this.textareaDom) {
				this.textareaDom.field.value = this.pendingValue;
			}

			this.requestUpdate();
		}

		checkValidity(): boolean {
			return this.textareaDom?.field.checkValidity() ?? true;
		}

		focus(options?: FocusOptions): void {
			this.textareaDom?.field.focus(options);
		}

		reportValidity(): boolean {
			return this.textareaDom?.field.reportValidity() ?? true;
		}

		select(): void {
			this.textareaDom?.field.select();
		}

		setCustomValidity(message: string): void {
			this.textareaDom?.field.setCustomValidity(message);
		}
	};
};
