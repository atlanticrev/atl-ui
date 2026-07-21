import { createTypedEvent, upgradeProperties } from '../../core';

import { createDropdownDom } from './dropdown-dom';
import { bindDropdownInteractions } from './dropdown-interactions';
import { createDropdownPropertiesClass } from './dropdown-properties';
import { renderDropdown } from './dropdown-view';
import type { AltDropdownChangeDetail } from './types';

export const createAltDropdownElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const DropdownPropertiesElement = createDropdownPropertiesClass(HtmlElementConstructor);

	return class AltDropdownElement extends DropdownPropertiesElement {
		static observedAttributes = [
			'empty-text',
			'footer-text',
			'max-height',
			'multiple',
			'select-all-text',
			'show-footer',
		];
		attributeChangedCallback(): void {
			this.requestUpdate();
		}
		moveActive(direction: 1 | -1, edge?: 'end' | 'start'): void {
			this.dropdownModel.moveActive(direction, edge);
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, [
				'activeValue',
				'emptyIcon',
				'emptyText',
				'footerText',
				'multiple',
				'options',
				'value',
				'values',
			]);
			this.classList.add('alt-dropdown');
			if (!this.dropdownInitialized) {
				this.dropdownModel.initialize();
				this.dropdownInitialized = true;
			}
			this.dropdownDom ??= createDropdownDom(this);
			bindDropdownInteractions(
				this,
				this.dropdownModel,
				{
					onChange: this.#emitChange,
					onRender: () => this.requestUpdate(),
					onSelectAll: this.selectAll,
				},
				signal,
			);
		}

		select(value: string): boolean {
			const option = this.dropdownModel.options.find((entry) => entry.value === value && !entry.disabled);
			if (!option) return false;
			this.dropdownModel.activeValue = value;
			const changed = this.dropdownModel.selectActive();
			if (changed) this.#emitChange();
			return changed;
		}

		selectAll = (): boolean => {
			if (!this.multiple) return false;
			const enabled = this.dropdownModel.options
				.filter((option) => !option.disabled)
				.map((option) => option.value);
			const allSelected = enabled.every((value) => this.dropdownModel.values.includes(value));
			const changed = this.dropdownModel.setValues(allSelected ? [] : enabled);
			if (changed) this.#emitChange();
			return changed;
		};

		update(): void {
			if (!this.dropdownDom) return;
			this.dropdownModel.setMultiple(this.multiple);
			renderDropdown(this, this.dropdownDom, this.dropdownModel, this.dropdownViews, this.emptyIconValue);
		}

		#emitChange = (): void => {
			this.requestUpdate();
			const detail: AltDropdownChangeDetail = { value: this.value, values: this.values };
			this.dispatchEvent(createTypedEvent('alt-change', detail));
		};
	};
};
