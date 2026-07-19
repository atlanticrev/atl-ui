import { type ElementEnvironment, registerElement } from '../../core';

import { defineAltOption } from './option-element';
import { createAltSelectElementClass } from './select-element';

export const defineAltSelect = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	defineAltOption(environment);
	return registerElement('alt-select', createAltSelectElementClass, environment);
};
