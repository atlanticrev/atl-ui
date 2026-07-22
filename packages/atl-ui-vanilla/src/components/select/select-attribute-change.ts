import type { SelectRuntime } from './select-runtime';

export const handleSelectAttributeChange = (
	runtime: SelectRuntime,
	name: string,
	previous: string | null,
	value: string | null,
): boolean => {
	if (previous === value) return false;

	if (name === 'value') {
		runtime.model.setValues(value === null ? [] : [value]);

		runtime.model.defaultValues = value === null ? [] : [value];
	}

	if (name === 'disabled' && value !== null) runtime.close();

	if (name === 'open') runtime.syncOpenAttribute(value !== null);

	if (name === 'multiple') runtime.model.setMultiple(value !== null);

	return true;
};
