import type { AtlResolver, AtlFormValues } from '../core/types';
import type { AtlRuntimeFieldSchema, AtlRuntimeSchema } from './types';

const isEmptyValue = (value: unknown) => {
	if (Array.isArray(value)) {
		return value.length === 0;
	}

	if (typeof value === 'boolean') {
		return value === false;
	}

	return value == null || value === '';
};

const validateField = (field: AtlRuntimeFieldSchema, value: unknown) => {
	for (const rule of field.rules ?? []) {
		if (rule.type === 'required' && isEmptyValue(value)) {
			return rule.message ?? `${field.label ?? field.name} is required.`;
		}

		if (rule.type === 'email' && typeof value === 'string' && value !== '' && !/\S+@\S+\.\S+/.test(value)) {
			return rule.message ?? `${field.label ?? field.name} must be a valid email.`;
		}

		if (rule.type === 'minLength' && typeof value === 'string' && value.length < Number(rule.value ?? 0)) {
			return rule.message ?? `${field.label ?? field.name} is too short.`;
		}

		if (rule.type === 'maxLength' && typeof value === 'string' && value.length > Number(rule.value ?? 0)) {
			return rule.message ?? `${field.label ?? field.name} is too long.`;
		}
	}

	return undefined;
};

export const createRuntimeResolver = <Values extends AtlFormValues>(
	schema: AtlRuntimeSchema,
): AtlResolver<Values> => {
	return async (values) => {
		return Object.fromEntries(
			schema.fields
				.map((field) => {
					const message = validateField(field, values[field.name]);

					return message
						? [field.name, { message, type: 'runtime' }]
						: null;
				})
				.filter(Boolean) as Array<[string, { message: string; type: 'runtime' }]>,
		);
	};
};
