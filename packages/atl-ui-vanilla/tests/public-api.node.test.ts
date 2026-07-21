// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
	ATL_UI_VANILLA_VERSION,
	altIconMarkup,
	defineAllAltElements,
	defineAltAlert,
	defineAltAutocomplete,
	defineAltAvatar,
	defineAltDialog,
	defineAltDropdown,
	defineAltFileUpload,
	defineAltInput,
	defineAltPopup,
	defineAltProgress,
	defineAltSelect,
	defineAltTable,
	defineAltTabs,
	defineAltToastRegion,
	defineAltTooltip,
} from '../src';

describe('public API without browser globals', () => {
	it('imports every element without registration side effects', () => {
		expect(ATL_UI_VANILLA_VERSION).toBe('0.1.0');
		expect(altIconMarkup('check')).toContain('<svg');
		expect(defineAltAlert()).toBeUndefined();
		expect(defineAltAutocomplete()).toBeUndefined();
		expect(defineAltAvatar()).toBeUndefined();
		expect(defineAltDialog()).toBeUndefined();
		expect(defineAltDropdown()).toBeUndefined();
		expect(defineAltFileUpload()).toBeUndefined();
		expect(defineAltInput()).toBeUndefined();
		expect(defineAltPopup()).toBeUndefined();
		expect(defineAltProgress()).toBeUndefined();
		expect(defineAltSelect()).toBeUndefined();
		expect(defineAltTable()).toBeUndefined();
		expect(defineAltTabs()).toBeUndefined();
		expect(defineAltToastRegion()).toBeUndefined();
		expect(defineAltTooltip()).toBeUndefined();
		expect(defineAllAltElements()).toEqual({
			alert: undefined,
			autocomplete: undefined,
			avatar: undefined,
			dialog: undefined,
			dropdown: undefined,
			fileUpload: undefined,
			input: undefined,
			popup: undefined,
			progress: undefined,
			select: undefined,
			table: undefined,
			tabs: undefined,
			toastRegion: undefined,
			tooltip: undefined,
		});
	});
});
