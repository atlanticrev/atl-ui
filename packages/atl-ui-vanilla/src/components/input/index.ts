import { type ElementEnvironment, registerElement } from '../../core';

import { createAltInputElementClass } from './input-element';

export { createAltInputElementClass } from './input-element';
export type {
	AltInputChangeDetail,
	AltInputElementApi,
	AltInputSize,
	AltInputStatus,
	AltInputVariant,
} from './types';

export const defineAltInput = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-input', createAltInputElementClass, environment);
};
