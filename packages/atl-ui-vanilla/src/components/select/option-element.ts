import { createBaseElementClass, type ElementEnvironment, registerElement, upgradeProperties } from '../../core';

import { reflectBoolean, reflectString } from './attributes';

export type AltOptionElementApi = HTMLElement & {
	description: string;
	disabled: boolean;
	label: string;
	selected: boolean;
	value: string;
};

export const createAltOptionElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltOptionElement extends BaseElement {
		public static observedAttributes = ['description', 'disabled', 'label', 'selected', 'value'];

		public get description(): string {
			return this.getAttribute('description') ?? '';
		}

		public set description(value: string) {
			reflectString(this, 'description', value);
		}

		public get disabled(): boolean {
			return this.hasAttribute('disabled');
		}

		public set disabled(value: boolean) {
			reflectBoolean(this, 'disabled', value);
		}

		public get label(): string {
			return this.getAttribute('label') ?? this.textContent?.trim() ?? '';
		}

		public set label(value: string) {
			reflectString(this, 'label', value);
		}

		public get selected(): boolean {
			return this.hasAttribute('selected');
		}

		public set selected(value: boolean) {
			reflectBoolean(this, 'selected', value);
		}

		public get value(): string {
			return this.getAttribute('value') ?? this.textContent?.trim() ?? '';
		}

		public set value(value: string) {
			reflectString(this, 'value', value);
		}

		public override onConnected(): void {
			upgradeProperties(this, ['description', 'disabled', 'label', 'selected', 'value']);
			this.hidden = true;
			this.setAttribute('aria-hidden', 'true');
		}
	};
};

export const defineAltOption = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-option', createAltOptionElementClass, environment);
};
