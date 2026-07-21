import { booleanAttributeConverter, createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createFileUploadDom, type FileUploadDom, formatSelectedFiles } from './file-upload-dom';
import { FILE_UPLOAD_OBSERVED_ATTRIBUTES, FILE_UPLOAD_PRE_UPGRADE_PROPERTIES } from './file-upload-constants';
import { defineFileUploadIconProperty, syncFileUploadIcon } from './file-upload-icon';
import type { AltFileUploadChangeDetail, AltFileUploadStatus } from './types';

const reflectedBoolean = (element: HTMLElement, name: string, value: boolean): void => {
	const attribute = booleanAttributeConverter.toAttribute(value);
	if (attribute === null) element.removeAttribute(name);
	else element.setAttribute(name, attribute);
};

export const createAltFileUploadElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	class AltFileUploadElement extends BaseElement {
		static observedAttributes = FILE_UPLOAD_OBSERVED_ATTRIBUTES;
		#dom: FileUploadDom | undefined;

		get accept(): string {
			return this.getAttribute('accept') ?? '';
		}
		set accept(value: string) {
			this.setAttribute('accept', value);
		}
		get disabled(): boolean {
			return this.hasAttribute('disabled');
		}
		set disabled(value: boolean) {
			reflectedBoolean(this, 'disabled', value);
		}
		get helperText(): string {
			return this.getAttribute('helper-text') ?? '';
		}
		set helperText(value: string) {
			this.setAttribute('helper-text', value);
		}
		get label(): string {
			return this.getAttribute('label') ?? 'Choose file';
		}
		set label(value: string) {
			this.setAttribute('label', value);
		}
		get multiple(): boolean {
			return this.hasAttribute('multiple');
		}
		set multiple(value: boolean) {
			reflectedBoolean(this, 'multiple', value);
		}
		get name(): string {
			return this.getAttribute('name') ?? '';
		}
		set name(value: string) {
			this.setAttribute('name', value);
		}
		get status(): AltFileUploadStatus {
			const value = this.getAttribute('status');
			return value === 'error' || value === 'success' ? value : 'default';
		}
		set status(value: AltFileUploadStatus) {
			this.setAttribute('status', value);
		}
		get files(): FileList | null {
			return this.#dom?.input.files ?? null;
		}
		get inputElement(): HTMLInputElement | null {
			return this.#dom?.input ?? null;
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, FILE_UPLOAD_PRE_UPGRADE_PROPERTIES);
			this.classList.add('alt-file-upload');
			this.#dom ??= createFileUploadDom(this);
			this.#dom.input.addEventListener('change', this.#handleChange, { signal });
			this.ownerDocument.addEventListener('reset', this.#handleReset, { capture: true, signal });
		}

		clear(): void {
			if (!this.#dom) return;
			this.#dom.input.value = '';
			this.requestUpdate();
		}

		update(): void {
			if (!this.#dom) return;
			this.dataset.status = this.status;
			this.setAttribute('aria-disabled', String(this.disabled));
			this.#dom.buttonLabel.textContent = this.label;
			syncFileUploadIcon(this, this.#dom);
			this.#dom.input.accept = this.accept;
			this.#dom.input.disabled = this.disabled;
			this.#dom.input.multiple = this.multiple;
			this.#dom.input.name = this.name;
			this.#dom.value.textContent = formatSelectedFiles(this.files);
			this.#dom.value.hidden = !this.#dom.value.textContent;
			this.#dom.helper.textContent = this.helperText;
			this.#dom.helper.hidden = !this.helperText;
		}

		#handleChange = (): void => {
			const files = Array.from(this.files ?? []);
			this.requestUpdate();
			this.dispatchEvent(createTypedEvent<AltFileUploadChangeDetail>('alt-change', { files }));
		};
		#handleReset = (event: Event): void => {
			if (event.target === this.#dom?.input.form) queueMicrotask(() => this.requestUpdate());
		};
	}

	defineFileUploadIconProperty(AltFileUploadElement.prototype);
	return AltFileUploadElement;
};
