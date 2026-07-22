// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { createAltTabsElementClass, defineAltTabs } from '../../src/components/tabs';

describe('alt-tabs SSR imports', () => {
	it('imports without browser globals and leaves registration explicit', () => {
		expect(createAltTabsElementClass).toBeTypeOf('function');

		expect(defineAltTabs()).toBeUndefined();
	});
});
