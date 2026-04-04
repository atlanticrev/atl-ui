import { createContext, useContext } from 'react';

import type { AtlFormStore, AtlFormValues } from '../core/types';

export type FormContextValue = AtlFormStore<AtlFormValues, unknown> | null;

export const AtlFormContext = createContext<FormContextValue>(null);

export const useAtlFormContext = <Values extends AtlFormValues, Context = unknown>() => {
	const context = useContext(AtlFormContext);

	if (!context) {
		throw new Error('AtlForm hooks must be used within AtlFormProvider or receive a form instance.');
	}

	return context as AtlFormStore<Values, Context>;
};
