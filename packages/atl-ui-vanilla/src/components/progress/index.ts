import { type ElementEnvironment, registerElement } from '../../core';

import { createAltProgressElementClass } from './progress-element';

export { createAltProgressElementClass } from './progress-element';
export type { AltProgressElementApi, AltProgressShape, AltProgressSize, AltProgressStatus } from './types';

export const defineAltProgress = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-progress', createAltProgressElementClass, environment);
};
