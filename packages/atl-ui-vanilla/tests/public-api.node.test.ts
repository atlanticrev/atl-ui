// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
	ATL_UI_VANILLA_VERSION,
	defineAllAltElements,
	defineAltInput,
	defineAltSelect,
	defineAltTabs,
	defineAltToastRegion,
} from '../src';

describe('public API without browser globals', () => {
	it('imports every pilot element without registration side effects', () => {
		expect(ATL_UI_VANILLA_VERSION).toBe('0.1.0');
		expect(defineAltInput()).toBeUndefined();
		expect(defineAltSelect()).toBeUndefined();
		expect(defineAltTabs()).toBeUndefined();
		expect(defineAltToastRegion()).toBeUndefined();
		expect(defineAllAltElements()).toEqual({
			input: undefined,
			select: undefined,
			tabs: undefined,
			toastRegion: undefined,
		});
	});
});
