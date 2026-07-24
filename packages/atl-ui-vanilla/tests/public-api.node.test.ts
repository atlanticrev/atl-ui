// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
	ATL_UI_VANILLA_VERSION,
	altIconMarkup,
	defineAllAltElements,
	defineAltAlert,
	defineAltAutocomplete,
	defineAltAvatar,
	defineAltCalendar,
	defineAltCollapse,
	defineAltDatePicker,
	defineAltDateRangePicker,
	defineAltDialog,
	defineAltDrawer,
	defineAltDropdown,
	defineAltFileUpload,
	defineAltInput,
	defineAltMenu,
	defineAltPagination,
	defineAltPopup,
	defineAltProgress,
	defineAltSearch,
	defineAltSelect,
	defineAltTable,
	defineAltTabs,
	defineAltTextarea,
	defineAltToastRegion,
	defineAltTooltip,
} from '../src';

describe('public API without browser globals', () => {
	it('imports every element without registration side effects', () => {
		expect(ATL_UI_VANILLA_VERSION).toBe('0.3.1');

		expect(altIconMarkup('check')).toContain('<svg');

		expect(defineAltAlert()).toBeUndefined();

		expect(defineAltAutocomplete()).toBeUndefined();

		expect(defineAltAvatar()).toBeUndefined();

		expect(defineAltCalendar()).toBeUndefined();

		expect(defineAltCollapse()).toBeUndefined();

		expect(defineAltDatePicker()).toBeUndefined();

		expect(defineAltDateRangePicker()).toBeUndefined();

		expect(defineAltDialog()).toBeUndefined();

		expect(defineAltDrawer()).toBeUndefined();

		expect(defineAltDropdown()).toBeUndefined();

		expect(defineAltFileUpload()).toBeUndefined();

		expect(defineAltInput()).toBeUndefined();

		expect(defineAltMenu()).toBeUndefined();

		expect(defineAltPagination()).toBeUndefined();

		expect(defineAltPopup()).toBeUndefined();

		expect(defineAltProgress()).toBeUndefined();

		expect(defineAltSearch()).toBeUndefined();

		expect(defineAltSelect()).toBeUndefined();

		expect(defineAltTable()).toBeUndefined();

		expect(defineAltTabs()).toBeUndefined();

		expect(defineAltTextarea()).toBeUndefined();

		expect(defineAltToastRegion()).toBeUndefined();

		expect(defineAltTooltip()).toBeUndefined();

		expect(defineAllAltElements()).toEqual({
			alert: undefined,
			autocomplete: undefined,
			avatar: undefined,
			calendar: undefined,
			collapse: undefined,
			datePicker: undefined,
			dateRangePicker: undefined,
			dialog: undefined,
			drawer: undefined,
			dropdown: undefined,
			fileUpload: undefined,
			input: undefined,
			menu: undefined,
			pagination: undefined,
			popup: undefined,
			progress: undefined,
			search: undefined,
			select: undefined,
			table: undefined,
			tabs: undefined,
			textarea: undefined,
			toastRegion: undefined,
			tooltip: undefined,
		});
	});
});
