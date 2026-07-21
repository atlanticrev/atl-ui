import {
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
} from './components';
import type { ElementEnvironment } from './core';

export type AltElementDefinitions = {
	alert: CustomElementConstructor | undefined;
	autocomplete: CustomElementConstructor | undefined;
	avatar: CustomElementConstructor | undefined;
	dialog: CustomElementConstructor | undefined;
	dropdown: CustomElementConstructor | undefined;
	fileUpload: CustomElementConstructor | undefined;
	input: CustomElementConstructor | undefined;
	popup: CustomElementConstructor | undefined;
	progress: CustomElementConstructor | undefined;
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
		dialog: defineAltDialog(environment),
		dropdown: defineAltDropdown(environment),
		fileUpload: defineAltFileUpload(environment),
		input: defineAltInput(environment),
		popup: defineAltPopup(environment),
		progress: defineAltProgress(environment),
		select: defineAltSelect(environment),
		table: defineAltTable(environment),
		tabs: defineAltTabs(environment),
		toastRegion: defineAltToastRegion(environment),
		tooltip: defineAltTooltip(environment),
	};
};
