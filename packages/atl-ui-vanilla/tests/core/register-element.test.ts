import { describe, expect, it, vi } from 'vitest';

import { registerElement } from '../../src/core';

const TEST_TAG = 'alt-core-registration-test';

describe('element registration', () => {
	it('defines an element once and returns the registered constructor', () => {
		const factory = vi.fn((HtmlElementConstructor: typeof HTMLElement) => {
			return class RegistrationElement extends HtmlElementConstructor {};
		});

		const firstResult = registerElement(TEST_TAG, factory);
		const secondResult = registerElement(TEST_TAG, factory);

		expect(firstResult).toBe(customElements.get(TEST_TAG));
		expect(secondResult).toBe(firstResult);
		expect(factory).toHaveBeenCalledTimes(1);
	});
});
