import { createBaseElementClass, upgradeProperties } from '../../core';

import { SELECT_OBSERVED_ATTRIBUTES, SELECT_PRE_UPGRADE_PROPERTIES } from './constants';
import { defineSelectFormApi } from './form-api';
import { defineSelectReflectedProperties } from './reflected-properties';
import { handleSelectAttributeChange } from './select-attribute-change';
import { defineSelectIndicatorIconProperty, defineSelectLeadingIconProperty } from './select-indicator-icon';
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

		public get closeOnSelect(): boolean {
			const configured = this.getAttribute('close-on-select');
			return configured === null ? !this.hasAttribute('multiple') : configured !== 'false';
		}

		public set closeOnSelect(value: boolean) {
			this.setAttribute('close-on-select', String(value));
		}

		public get triggerElement(): HTMLElement | null {
			return this.#runtime.triggerElement;
		}

		public set triggerElement(value: HTMLElement | null) {
			if (value) this.#runtime.setTriggerElement(value);
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

		public clear(): void {
			this.#runtime.clear();
		}

		public select(value: string): boolean {
			return this.#runtime.select(value);
		}

		public override focus(options?: FocusOptions): void {
			this.#runtime.triggerElement?.focus(options);
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
			if (handleSelectAttributeChange(this.#runtime, name, previous, value)) this.requestUpdate();
		}
	}

	defineSelectReflectedProperties(AltSelectElement.prototype);
	defineSelectIndicatorIconProperty(AltSelectElement.prototype);
	defineSelectLeadingIconProperty(AltSelectElement.prototype);
	defineSelectFormApi(AltSelectElement.prototype);
	return AltSelectElement;
};
