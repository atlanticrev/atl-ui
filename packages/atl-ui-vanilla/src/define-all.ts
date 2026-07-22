import {
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
	defineAltToastRegion,
	defineAltTooltip,
} from './components';
import type { ElementEnvironment } from './core';

export type AltElementDefinitions = {
	alert: CustomElementConstructor | undefined;
	autocomplete: CustomElementConstructor | undefined;
	avatar: CustomElementConstructor | undefined;
	calendar: CustomElementConstructor | undefined;
	collapse: CustomElementConstructor | undefined;
	datePicker: CustomElementConstructor | undefined;
	dateRangePicker: CustomElementConstructor | undefined;
	dialog: CustomElementConstructor | undefined;
	drawer: CustomElementConstructor | undefined;
	dropdown: CustomElementConstructor | undefined;
	fileUpload: CustomElementConstructor | undefined;
	input: CustomElementConstructor | undefined;
	menu: CustomElementConstructor | undefined;
	pagination: CustomElementConstructor | undefined;
	popup: CustomElementConstructor | undefined;
	progress: CustomElementConstructor | undefined;
	search: CustomElementConstructor | undefined;
	select: CustomElementConstructor | undefined;
	table: CustomElementConstructor | undefined;
	tabs: CustomElementConstructor | undefined;
	toastRegion: CustomElementConstructor | undefined;
	tooltip: CustomElementConstructor | undefined;
};

export const defineAllAltElements = (environment?: ElementEnvironment): AltElementDefinitions => {
	return {
		alert: defineAltAlert(environment),
		autocomplete: defineAltAutocomplete(environment),
		avatar: defineAltAvatar(environment),
		calendar: defineAltCalendar(environment),
		collapse: defineAltCollapse(environment),
		datePicker: defineAltDatePicker(environment),
		dateRangePicker: defineAltDateRangePicker(environment),
		dialog: defineAltDialog(environment),
		drawer: defineAltDrawer(environment),
		dropdown: defineAltDropdown(environment),
		fileUpload: defineAltFileUpload(environment),
		input: defineAltInput(environment),
		menu: defineAltMenu(environment),
		pagination: defineAltPagination(environment),
		popup: defineAltPopup(environment),
		progress: defineAltProgress(environment),
		search: defineAltSearch(environment),
		select: defineAltSelect(environment),
		table: defineAltTable(environment),
		tabs: defineAltTabs(environment),
		toastRegion: defineAltToastRegion(environment),
		tooltip: defineAltTooltip(environment),
	};
};
