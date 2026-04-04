import type { ReactNode } from 'react';

import { useAtlField } from './use-atl-field';

import type { AtlFieldRegistration, AtlFormStore, AtlFormValues } from '../core/types';

type AtlControllerProps<Values extends AtlFormValues, Context = unknown> = AtlFieldRegistration & {
	children: (field: ReturnType<typeof useAtlField<Values, Context>>) => ReactNode;
	form?: AtlFormStore<Values, Context>;
	name: string;
};

export const AtlController = <Values extends AtlFormValues, Context = unknown>({
	children,
	form,
	name,
	...options
}: AtlControllerProps<Values, Context>) => {
	const field = useAtlField(name, {
		...options,
		form,
	});

	return children(field);
};
