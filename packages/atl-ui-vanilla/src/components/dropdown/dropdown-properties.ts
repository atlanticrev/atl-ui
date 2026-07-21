import { createBaseElementClass } from '../../core';
import { SelectModel } from '../select/model';
import type { OptionView } from '../select/option-view';

import type { DropdownDom } from './dropdown-dom';
import type { AltDropdownOption } from './types';

export const createDropdownPropertiesClass = (HtmlElementConstructor: typeof HTMLElement) => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class DropdownPropertiesElement extends BaseElement {
		dropdownDom: DropdownDom | undefined;
		dropdownInitialized = false;
		dropdownModel = new SelectModel(this);
		dropdownViews = new Map<string, OptionView>();
		emptyIconValue: Node | null = null;

		get activeValue(): string {
			return this.dropdownModel.activeValue ?? '';
		}
		set activeValue(value: string) {
			this.dropdownModel.activeValue = value;
			this.requestUpdate();
		}
		get emptyText(): string {
			return this.getAttribute('empty-text') ?? 'No options';
		}
		set emptyText(value: string) {
			this.setAttribute('empty-text', value);
		}
		get emptyIcon(): Node | null {
			return this.emptyIconValue;
		}
		set emptyIcon(value: Node | null) {
			this.emptyIconValue = value;
			this.requestUpdate();
		}
		get footerText(): string {
			return this.getAttribute('footer-text') ?? '';
		}
		set footerText(value: string) {
			this.setAttribute('footer-text', value);
		}
		get multiple(): boolean {
			return this.hasAttribute('multiple');
		}
		set multiple(value: boolean) {
			this.toggleAttribute('multiple', value);
		}
		get options(): readonly AltDropdownOption[] {
			return this.dropdownModel.options;
		}
		set options(value: readonly AltDropdownOption[]) {
			this.dropdownModel.options = value;
			this.requestUpdate();
		}
		get value(): string {
			return this.dropdownModel.value;
		}
		set value(value: string) {
			this.values = value ? [value] : [];
		}
		get values(): readonly string[] {
			return this.dropdownModel.values;
		}
		set values(value: readonly string[]) {
			this.dropdownModel.setValues(value);
			this.requestUpdate();
		}
	};
};
