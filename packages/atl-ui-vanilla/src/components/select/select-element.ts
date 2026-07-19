import { createBaseElementClass, upgradeProperties } from '../../core';

import { SELECT_OBSERVED_ATTRIBUTES, SELECT_PRE_UPGRADE_PROPERTIES } from './constants';
import { defineSelectFormApi } from './form-api';
import { defineSelectReflectedProperties } from './reflected-properties';
import { SelectRuntime } from './select-runtime';
import type { AltSelectOption } from './types';

export const createAltSelectElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	class AltSelectElement extends BaseElement {
		public static observedAttributes = SELECT_OBSERVED_ATTRIBUTES;
		readonly #runtime = new SelectRuntime(this);

		public get open(): boolean {
			return this.#runtime.isOpen();
		}

		public set open(value: boolean) {
			this.#runtime.setOpen(value);
		}

		public get options(): readonly AltSelectOption[] {
			return this.#runtime.model.options;
		}

		public set options(value: readonly AltSelectOption[]) {
			this.#runtime.model.options = value;
			this.#runtime.render();
		}

		public get value(): string {
			return this.#runtime.model.value;
		}

		public set value(value: string) {
			this.values = value ? [value] : [];
		}

		public get values(): readonly string[] {
			return this.#runtime.model.values;
		}

		public set values(values: readonly string[]) {
			this.#runtime.model.setMultiple(this.hasAttribute('multiple'));
			this.#runtime.model.setValues(values);
			this.#runtime.render();
		}

		public show(): void {
			this.#runtime.setOpen(true);
		}

		public close(): void {
			this.#runtime.setOpen(false);
		}

		public toggle(): void {
			this.#runtime.toggle();
		}

		public override focus(options?: FocusOptions): void {
			this.querySelector<HTMLButtonElement>('.alt-select__trigger')?.focus(options);
		}

		public override onConnected(signal: AbortSignal): void {
			upgradeProperties(this, SELECT_PRE_UPGRADE_PROPERTIES);
			this.#runtime.connect(signal);
		}

		public override onDisconnected(): void {
			this.#runtime.disconnect();
		}

		public override update(): void {
			this.#runtime.render();
		}

		public attributeChangedCallback(name: string, previous: string | null, value: string | null): void {
			if (previous === value) {
				return;
			}

			if (name === 'value') {
				this.#runtime.model.setValues(value === null ? [] : [value]);
				this.#runtime.model.defaultValues = value === null ? [] : [value];
			}

			if (name === 'disabled' && value !== null) {
				this.#runtime.close();
			}

			if (name === 'open') {
				this.#runtime.setOpen(value !== null);
			}

			if (name === 'multiple') {
				this.#runtime.model.setMultiple(value !== null);
			}

			this.requestUpdate();
		}
	}

	defineSelectReflectedProperties(AltSelectElement.prototype);
	defineSelectFormApi(AltSelectElement.prototype);
	return AltSelectElement;
};
