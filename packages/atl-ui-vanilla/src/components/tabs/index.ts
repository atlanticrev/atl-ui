import { type ElementEnvironment, registerElement } from '../../core';

import { createAltTabsElementClass } from './tabs-element';

export { createAltTabsElementClass } from './tabs-element';
export type { AltTabsChangeDetail, AltTabsElementApi } from './types';

export const defineAltTabs = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-tabs', createAltTabsElementClass, environment);
};
