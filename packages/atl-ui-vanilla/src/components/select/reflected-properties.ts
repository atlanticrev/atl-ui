import { reflectBoolean, reflectString } from './attributes';

type PropertyTarget = typeof HTMLElement.prototype;

const defineBooleanProperty = (target: PropertyTarget, name: string): void => {
	Object.defineProperty(target, name, {
		configurable: true,
		get(this: HTMLElement): boolean {
			return this.hasAttribute(name);
		},
		set(this: HTMLElement, value: boolean): void {
			reflectBoolean(this, name, value);
		},
	});
};

const defineStringProperty = (target: PropertyTarget, name: string): void => {
	defineMappedStringProperty(target, name, name);
};

const defineMappedStringProperty = (target: PropertyTarget, property: string, attribute: string): void => {
	Object.defineProperty(target, property, {
		configurable: true,
		get(this: HTMLElement): string {
			return this.getAttribute(attribute) ?? '';
		},
		set(this: HTMLElement, value: string): void {
			reflectString(this, attribute, value);
		},
	});
};

export const defineSelectReflectedProperties = (target: PropertyTarget): void => {
	defineBooleanProperty(target, 'disabled');
	defineBooleanProperty(target, 'multiple');
	defineBooleanProperty(target, 'required');
	defineStringProperty(target, 'description');
	defineMappedStringProperty(target, 'helperText', 'helper-text');
	defineStringProperty(target, 'label');
	defineStringProperty(target, 'name');
	defineStringProperty(target, 'placeholder');
	defineStringProperty(target, 'size');
	defineStringProperty(target, 'status');
};
