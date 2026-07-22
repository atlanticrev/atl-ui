import { type ElementEnvironment, registerElement } from '../../core';

import { createAltSearchElementClass } from './search-element';

export { createAltSearchElementClass } from './search-element';
export type { AltSearchChangeDetail, AltSearchElementApi } from './types';

export const defineAltSearch = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-search', createAltSearchElementClass, environment);
};
