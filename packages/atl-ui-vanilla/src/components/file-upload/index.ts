import { type ElementEnvironment, registerElement } from '../../core';

import { createAltFileUploadElementClass } from './file-upload-element';

export { createAltFileUploadElementClass } from './file-upload-element';
export type {
	AltFileUploadChangeDetail,
	AltFileUploadElementApi,
	AltFileUploadStatus,
} from './types';

export const defineAltFileUpload = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-file-upload', createAltFileUploadElementClass, environment);
};
