import { useEffect, useSyncExternalStore } from 'react';

import { useResolvedForm } from './use-resolved-form';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlUseFieldOptions<Values extends AtlFormValues, Context = unknown> = AtlFieldRegistration & {
	form?: AtlFormStore<Values, Context>;
};

export const useAtlField = <Values extends AtlFormValues, Context = unknown>(
	name: string,
	options?: AtlUseFieldOptions<Values, Context>,
) => {
	const form = useResolvedForm(options?.form);
	const {
		defaultValue,
		disabled,
		keepErrorOnUnmount,
		keepStateOnUnmount,
		keepValueOnUnmount,
		required,
	} = options ?? {};

	useEffect(() => {
		form.registerField(name, {
			defaultValue,
			disabled,
			keepErrorOnUnmount,
			keepStateOnUnmount,
			keepValueOnUnmount,
			required,
		});

		return () => {
			form.unregisterField(name, {
				keepErrorOnUnmount,
				keepStateOnUnmount,
				keepValueOnUnmount,
			});
		};
	}, [
		defaultValue,
		disabled,
		form,
		keepErrorOnUnmount,
		keepStateOnUnmount,
		keepValueOnUnmount,
		name,
		required,
	]);

	const version = useSyncExternalStore(
		(listener) => form.subscribeField(name, listener),
		() => form.getFieldStateVersion(name),
		() => form.getFieldStateVersion(name),
	);
	void version;
	const field = form.getFieldState(name);

	return {
		...field,
		message: field.error?.message,
		onBlur: () => form.touchField(name),
		reset: (nextValue?: unknown) => form.resetField(name, nextValue),
		setValue: (value: unknown) => form.setValue(name, value),
	};
};
