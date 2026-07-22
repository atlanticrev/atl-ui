import { type ElementEnvironment, registerElement } from '../../core';

import { createAltCollapseElementClass } from './collapse-element';

export { createAltCollapseElementClass } from './collapse-element';
export type { AltCollapseChangeDetail, AltCollapseElementApi } from './types';

export const defineAltCollapse = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-collapse', createAltCollapseElementClass, environment);
};
