import { type ElementEnvironment, registerElement } from '../../core';

import { createAltMenuElementClass } from './menu-element';

export { createAltMenuElementClass } from './menu-element';
export type { AltMenuElementApi, AltMenuSelectDetail } from './types';

export const defineAltMenu = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-menu', createAltMenuElementClass, environment);
};
