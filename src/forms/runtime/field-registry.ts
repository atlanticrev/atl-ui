import type { AtlFormValues } from '../core/types';
import type { AtlRuntimeFieldRegistry } from './types';

export const createAtlFieldRegistry = <Values extends AtlFormValues>(
	registry: AtlRuntimeFieldRegistry<Values>,
) => registry;
