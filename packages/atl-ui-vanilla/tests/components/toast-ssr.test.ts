// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { createAltToastRegionElementClass, defineAltToastRegion } from '../../src/components/toast';

describe('alt-toast-region SSR imports', () => {
	it('imports without browser globals and leaves registration explicit', () => {
		expect(createAltToastRegionElementClass).toBeTypeOf('function');

		expect(defineAltToastRegion()).toBeUndefined();
	});
});
