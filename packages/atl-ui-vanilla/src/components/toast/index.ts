import { type ElementEnvironment, registerElement } from '../../core';

import { createAltToastRegionElementClass } from './toast-element';

export { createAltToastRegionElementClass } from './toast-element';
export type {
	AltToastDismissDetail,
	AltToastDismissReason,
	AltToastElementApi,
	AltToastOptions,
	AltToastStatus,
} from './types';

export const defineAltToastRegion = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-toast-region', createAltToastRegionElementClass, environment);
};
