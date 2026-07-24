import { type ElementEnvironment, registerElement } from '../../core';

import { createAltTextareaElementClass } from './textarea-element';

export { createAltTextareaElementClass } from './textarea-element';
export type {
	AltTextareaChangeDetail,
	AltTextareaElementApi,
	AltTextareaSize,
	AltTextareaStatus,
} from './types';

export const defineAltTextarea = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-textarea', createAltTextareaElementClass, environment);
};
