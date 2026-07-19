// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { defineAltSelect } from '../../src/components/select';

describe('alt-select server import', () => {
	it('imports without browser globals and leaves registration explicit', () => {
		expect(defineAltSelect()).toBeUndefined();
	});
});
