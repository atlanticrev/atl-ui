import type { AtlSelectProps } from '@/components/select/types';

import { useAtlField } from '../react/use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlSelectBindingOptions<Values extends AtlFormValues, Context = unknown> =
	AtlFieldRegistration & {
		form?: AtlFormStore<Values, Context>;
		multiSelect?: boolean;
	};

export const useAtlSelectBinding = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options?: AtlSelectBindingOptions<Values, Context>,
) => {
	const field = useAtlField(name, options);
	const selectProps: {
		helperText?: string;
		onChange: (value: unknown) => void;
		status: AtlSelectProps<unknown>['status'];
		value: unknown;
	} = {
		helperText: field.message,
		onChange: (value: unknown) => field.setValue(value),
		status: field.invalid ? 'error' : 'default',
		value: options?.multiSelect ? ((field.value as unknown[]) ?? []) : field.value,
	};

	return {
		field,
		message: field.message,
		selectProps,
		status: selectProps.status,
	};
};
