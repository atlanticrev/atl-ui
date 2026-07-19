import { defineAltInput, defineAltSelect, defineAltTabs, defineAltToastRegion } from './components';
import type { ElementEnvironment } from './core';

export type AltElementDefinitions = {
	input: CustomElementConstructor | undefined;
	select: CustomElementConstructor | undefined;
	tabs: CustomElementConstructor | undefined;
	toastRegion: CustomElementConstructor | undefined;
};

export const defineAllAltElements = (environment?: ElementEnvironment): AltElementDefinitions => {
	return {
		input: defineAltInput(environment),
		select: defineAltSelect(environment),
		tabs: defineAltTabs(environment),
		toastRegion: defineAltToastRegion(environment),
	};
};
