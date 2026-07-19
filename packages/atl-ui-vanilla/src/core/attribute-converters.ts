export type AttributeConverter<T> = {
	fromAttribute: (value: string | null) => T;
	toAttribute: (value: T) => string | null;
};

export const booleanAttributeConverter: AttributeConverter<boolean> = {
	fromAttribute: (value) => value !== null,
	toAttribute: (value) => (value ? '' : null),
};

export const numberAttributeConverter: AttributeConverter<number | null> = {
	fromAttribute: (value) => {
		if (value === null || value.trim() === '') {
			return null;
		}

		const parsedValue = Number(value);

		return Number.isFinite(parsedValue) ? parsedValue : null;
	},
	toAttribute: (value) => (value !== null && Number.isFinite(value) ? String(value) : null),
};

export const stringAttributeConverter: AttributeConverter<string | null> = {
	fromAttribute: (value) => value,
	toAttribute: (value) => value,
};
