import { type ElementEnvironment, registerElement } from '../../core';

import { createAltAlertElementClass } from './alert-element';

export { createAltAlertElementClass } from './alert-element';
export type {
	AltAlertCloseDetail,
	AltAlertCloseReason,
	AltAlertElementApi,
	AltAlertIconMapping,
	AltAlertSeverity,
	AltAlertVariant,
} from './types';

export const defineAltAlert = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-alert', createAltAlertElementClass, environment);
};
