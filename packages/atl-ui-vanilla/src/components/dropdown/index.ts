import { type ElementEnvironment, registerElement } from '../../core';
import { defineAltOption } from '../select/option-element';

import { createAltDropdownElementClass } from './dropdown-element';

export { createAltDropdownElementClass } from './dropdown-element';
export type { AltDropdownChangeDetail, AltDropdownElementApi, AltDropdownOption } from './types';

export const defineAltDropdown = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	defineAltOption(environment);
	return registerElement('alt-dropdown', createAltDropdownElementClass, environment);
};
