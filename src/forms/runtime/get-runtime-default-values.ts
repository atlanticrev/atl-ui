import type { AtlRuntimeSchema } from './types';

export const getRuntimeDefaultValues = (schema: AtlRuntimeSchema) => {
	return Object.fromEntries(
		schema.fields
			.filter((field) => field.defaultValue !== undefined)
			.map((field) => [field.name, field.defaultValue]),
	);
};
