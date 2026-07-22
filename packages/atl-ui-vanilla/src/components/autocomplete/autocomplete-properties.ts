import { createBaseElementClass } from '../../core';

import type { AutocompleteDom } from './autocomplete-dom';
import { defineAutocompleteIconProperties } from './autocomplete-icon-properties';
import type { AltAutocompleteFilter, AltAutocompleteOption } from './types';

export const createAutocompletePropertiesClass = (HtmlElementConstructor: typeof HTMLElement) => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	class AutocompletePropertiesElement extends BaseElement {
		autocompleteDom: AutocompleteDom | undefined;
		filterValue: AltAutocompleteFilter | null = null;
		inputPatternValue: RegExp | null = null;
		inputPristineState = true;
		inputValueState = '';
		optionsAssigned = false;
		optionsValue: readonly AltAutocompleteOption[] = [];
		valuesState: string[] = [];

		get filter(): AltAutocompleteFilter | null {
			return this.filterValue;
		}
		set filter(value: AltAutocompleteFilter | null) {
			this.filterValue = value;

			this.requestUpdate();
		}
		get form(): HTMLFormElement | null {
			return this.autocompleteDom?.carrier.form ?? null;
		}
		get freeSolo(): boolean {
			return this.hasAttribute('free-solo');
		}
		set freeSolo(value: boolean) {
			this.toggleAttribute('free-solo', value);
		}
		get inputElement(): HTMLInputElement | null {
			return this.autocompleteDom?.inputElement ?? null;
		}
		get inputPattern(): RegExp | null {
			return this.inputPatternValue;
		}
		set inputPattern(value: RegExp | null) {
			this.inputPatternValue = value;
		}
		get inputValue(): string {
			return this.inputValueState;
		}
		set inputValue(value: string) {
			this.inputValueState = String(value);

			this.inputPristineState = false;

			this.requestUpdate();
		}
		get multiple(): boolean {
			return this.hasAttribute('multiple');
		}
		set multiple(value: boolean) {
			this.toggleAttribute('multiple', value);
		}
		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get options(): readonly AltAutocompleteOption[] {
			return this.optionsValue;
		}
		set options(value: readonly AltAutocompleteOption[]) {
			this.optionsAssigned = true;

			this.optionsValue = value;

			this.requestUpdate();
		}
		get readOnly(): boolean {
			return this.hasAttribute('readonly');
		}
		set readOnly(value: boolean) {
			this.toggleAttribute('readonly', value);
		}
		get triggerElement(): HTMLElement | null {
			return this.autocompleteDom?.trigger ?? null;
		}
		get value(): string {
			return this.valuesState[0] ?? this.getAttribute('value') ?? '';
		}
		set value(value: string) {
			const normalized = String(value);

			this.valuesState = normalized ? [normalized] : [];

			this.inputPristineState = true;

			if (normalized) this.setAttribute('value', normalized);
			else this.removeAttribute('value');
		}
		get values(): readonly string[] {
			return [...this.valuesState];
		}
		set values(value: readonly string[]) {
			this.valuesState = this.multiple ? [...new Set(value)] : value.slice(0, 1);

			this.inputPristineState = true;

			const firstValue = this.valuesState[0];

			if (firstValue) this.setAttribute('value', firstValue);
			else this.removeAttribute('value');

			this.requestUpdate();
		}
		get validationMessage(): string {
			return this.autocompleteDom?.carrier.validationMessage ?? '';
		}
		get validity(): ValidityState | null {
			return this.autocompleteDom?.carrier.validity ?? null;
		}
		checkValidity(): boolean {
			return this.autocompleteDom?.carrier.checkValidity() ?? true;
		}
		reportValidity(): boolean {
			return this.autocompleteDom?.carrier.reportValidity() ?? true;
		}
		setCustomValidity(message: string): void {
			this.autocompleteDom?.carrier.setCustomValidity(message);
		}
	}

	defineAutocompleteIconProperties(AutocompletePropertiesElement.prototype);

	return AutocompletePropertiesElement;
};
