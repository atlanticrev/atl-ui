// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import { registerElement } from '../../src/core';

describe('element registration without a browser', () => {
	it('imports safely and skips registration', () => {
		const factory = vi.fn();

		expect(registerElement('alt-core-server-test', factory)).toBeUndefined();
		expect(factory).not.toHaveBeenCalled();
	});
});
