import { type ElementEnvironment, registerElement } from '../../core';

import { createAltPopupElementClass } from './popup-element';

export { createAltPopupElementClass } from './popup-element';
export type { AltPopupElementApi, AltPopupOpenChangeDetail } from './types';

export const defineAltPopup = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-popup', createAltPopupElementClass, environment);
};
