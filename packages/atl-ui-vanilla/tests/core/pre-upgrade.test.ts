import { afterEach, describe, expect, it } from 'vitest';

import { createBaseElementClass, upgradeProperties, upgradeProperty } from '../../src/core';

const TEST_TAG = 'alt-core-pre-upgrade-test';

afterEach(() => {
	document.body.replaceChildren();
});

describe('pre-upgrade properties', () => {
	it('replays an own property through the upgraded prototype setter', () => {
		const element = document.createElement(TEST_TAG) as HTMLElement & { value: string };

		element.value = 'before-definition';

		document.body.append(element);

		const BaseElement = createBaseElementClass();

		class PreUpgradeElement extends BaseElement {
			public appliedValues: string[] = [];
			private currentValue = '';

			public constructor() {
				super();

				upgradeProperty(this, 'value');
			}

			public get value(): string {
				return this.currentValue;
			}

			public set value(value: string) {
				this.currentValue = value;

				this.appliedValues.push(value);
			}
		}

		customElements.define(TEST_TAG, PreUpgradeElement);

		const upgradedElement = element as PreUpgradeElement;

		expect(upgradedElement.value).toBe('before-definition');

		expect(upgradedElement.appliedValues).toEqual(['before-definition']);

		expect(Object.hasOwn(upgradedElement, 'value')).toBe(false);
	});

	it('reports missing properties and upgrades multiple properties', () => {
		const values: string[] = [];

		const prototype = {
			set first(value: string) {
				values.push(`first:${value}`);
			},
			set second(value: string) {
				values.push(`second:${value}`);
			},
		};

		const target = Object.assign(Object.create(prototype), {
			first: 'one',
			second: 'two',
		});

		expect(upgradeProperty(target, 'missing')).toBe(false);

		upgradeProperties(target, ['first', 'second']);

		expect(values).toEqual(['first:one', 'second:two']);
	});
});
