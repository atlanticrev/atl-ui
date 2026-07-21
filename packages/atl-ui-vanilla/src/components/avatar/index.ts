import { type ElementEnvironment, registerElement } from '../../core';

import { createAltAvatarElementClass } from './avatar-element';

export { createAltAvatarElementClass } from './avatar-element';
export type { AltAvatarElementApi, AltAvatarErrorDetail, AltAvatarShape } from './types';

export const defineAltAvatar = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-avatar', createAltAvatarElementClass, environment);
};
