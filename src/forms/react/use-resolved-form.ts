import { useContext } from 'react';

import { AtlFormContext } from './form-context';

import type { AtlFormStore, AtlFormValues } from '../core/types';

export const useResolvedForm = <Values extends AtlFormValues, Context = unknown>(
	form?: AtlFormStore<Values, Context>,
) => {
	const context = useContext(AtlFormContext);

	if (form) {
		return form;
	}

	if (!context) {
		throw new Error('AtlForm hooks must be used within AtlFormProvider or receive a form instance.');
	}

	return context as AtlFormStore<Values, Context>;
};
