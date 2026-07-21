import { type ElementEnvironment, registerElement } from '../../core';

import { createAltTooltipElementClass } from './tooltip-element';

export { createAltTooltipElementClass } from './tooltip-element';
export type {
	AltTooltipElementApi,
	AltTooltipOpenChangeDetail,
	AltTooltipPlacement,
	AltTooltipTrigger,
} from './types';

export const defineAltTooltip = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-tooltip', createAltTooltipElementClass, environment);
};
