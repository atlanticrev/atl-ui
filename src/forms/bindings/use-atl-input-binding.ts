import type { AtlInputProps } from '@/components/input/input.type';

import { useAtlField } from '../react/use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlInputBindingOptions<Values extends AtlFormValues, Context = unknown> =
	AtlFieldRegistration & {
		form?: AtlFormStore<Values, Context>;
		format?: (value: unknown) => string;
		parse?: (value: string) => unknown;
	};

export const useAtlInputBinding = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options?: AtlInputBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);
	const formatValue = options?.format ?? ((value: unknown) => (value == null ? '' : String(value)));
	const parseValue = options?.parse ?? ((value: string) => value);

	const inputProps: Pick<AtlInputProps, 'helperText' | 'onBlur' | 'onChange' | 'status' | 'value'> = {
		helperText: field.message,
		onBlur: field.onBlur,
		onChange: (value) => field.setValue(parseValue(value)),
		status: field.invalid ? 'error' : 'default',
		value: formatValue(field.value),
	};

	return {
		field,
		inputProps,
		message: field.message,
		status: inputProps.status,
	};
};
