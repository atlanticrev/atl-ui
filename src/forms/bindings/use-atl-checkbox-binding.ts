import type { AtlCheckboxProps } from '@/components/checkbox/types';

import { useAtlField } from '../react/use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlCheckboxBindingOptions<Values extends AtlFormValues, Context = unknown> =
	AtlFieldRegistration & {
		form?: AtlFormStore<Values, Context>;
	};

export const useAtlCheckboxBinding = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options?: AtlCheckboxBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);
	const checkboxProps: Pick<AtlCheckboxProps, 'checked' | 'invalid' | 'onChange'> = {
		checked: Boolean(field.value),
		invalid: field.invalid,
		onChange: (checked) => field.setValue(checked),
	};

	return {
		checkboxProps,
		field,
		message: field.message,
	};
};
