import type { AtlAutocompleteProps } from '@/components/autocomplete/types';

import { useAtlField } from '../react/use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlAutocompleteBindingOptions<Values extends AtlFormValues, Context = unknown> =
	AtlFieldRegistration & {
		form?: AtlFormStore<Values, Context>;
	};

export const useAtlAutocompleteBinding = <
	Values extends AtlFormValues,
	Context = unknown,
>(
	name: string,
	options?: AtlAutocompleteBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);
	const autocompleteProps: Pick<
		AtlAutocompleteProps<unknown>,
		'helperText' | 'onChange' | 'status' | 'value'
	> = {
		helperText: field.message,
		onChange: (value) => field.setValue(value),
		status: field.invalid ? 'error' : 'default',
		value: field.value,
	};

	return {
		autocompleteProps,
		field,
		message: field.message,
		status: autocompleteProps.status,
	};
};
