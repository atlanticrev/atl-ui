import { type ElementEnvironment, registerElement } from '../../core';

import { createAltDrawerElementClass } from './drawer-element';

export { createAltDrawerElementClass } from './drawer-element';
export type {
	AltDrawerCloseDetail,
	AltDrawerCloseReason,
	AltDrawerElementApi,
	AltDrawerOpenChangeDetail,
	AltDrawerPlacement,
} from './types';

export const defineAltDrawer = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-drawer', createAltDrawerElementClass, environment);
};
