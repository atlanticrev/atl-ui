import { createDefaultAtlFieldRegistry } from './default-field-registry';

import type { AtlFormValues } from '../core/types';
import type { AtlRuntimeFieldRegistry, AtlRuntimeFieldSchema } from './types';

type AtlRuntimeFieldProps<Values extends AtlFormValues> = {
	field: AtlRuntimeFieldSchema;
	fieldRegistry?: AtlRuntimeFieldRegistry<Values>;
	form: import('../core/types').AtlFormStore<Values>;
};

export const AtlRuntimeField = <Values extends AtlFormValues>({
	field,
	fieldRegistry,
	form,
}: AtlRuntimeFieldProps<Values>) => {
	const registry = fieldRegistry ?? createDefaultAtlFieldRegistry<Values>();
	const Renderer = registry[field.type];

	if (!Renderer) {
		return null;
	}

	return <Renderer field={field} form={form} />;
};
