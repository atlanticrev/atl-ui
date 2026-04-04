import type { PropsWithChildren } from 'react';

import { AtlFormContext } from './form-context';

import type { AtlFormStore, AtlFormValues } from '../core/types';
import type { FormContextValue } from './form-context';

type AtlFormProviderProps<Values extends AtlFormValues, Context = unknown> = PropsWithChildren<{
	form: AtlFormStore<Values, Context>;
}>;

export const AtlFormProvider = <Values extends AtlFormValues, Context = unknown>({
	children,
	form,
}: AtlFormProviderProps<Values, Context>) => {
	return <AtlFormContext.Provider value={form as FormContextValue}>{children}</AtlFormContext.Provider>;
};
