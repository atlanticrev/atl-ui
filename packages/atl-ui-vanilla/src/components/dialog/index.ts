import { type ElementEnvironment, registerElement } from '../../core';

import { createAltDialogElementClass } from './dialog-element';

export { createAltDialogElementClass } from './dialog-element';
export type {
	AltDialogCloseDetail,
	AltDialogElementApi,
	AltDialogOpenChangeDetail,
	AltDialogSize,
} from './types';

export const defineAltDialog = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-dialog', createAltDialogElementClass, environment);
};
