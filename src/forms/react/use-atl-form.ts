import { useEffect, useRef } from 'react';

import { createFormStore } from '../core/create-form-store';

import type { AtlFormOptions, AtlFormStore, AtlFormValues } from '../core/types';

export const useAtlForm = <Values extends AtlFormValues, Context = unknown>(
	options: AtlFormOptions<Values, Context>,
): AtlFormStore<Values, Context> => {
	const formRef = useRef<AtlFormStore<Values, Context>>();

	if (!formRef.current) {
		formRef.current = createFormStore(options);
	}

	useEffect(() => {
		formRef.current?.setOptions({
			context: options.context,
			resolver: options.resolver,
			revalidateMode: options.revalidateMode,
			validateMode: options.validateMode,
		});
	}, [options.context, options.revalidateMode, options.resolver, options.validateMode]);

	return formRef.current;
};
