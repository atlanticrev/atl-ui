import { useSyncExternalStore } from 'react';

import { useResolvedForm } from './use-resolved-form';

import type { AtlFormState, AtlFormStore, AtlFormValues } from '../core/types';

export const useAtlFormState = <
	Values extends AtlFormValues,
	Context = unknown,
	Selected = AtlFormState<Values>,
>(
	form?: AtlFormStore<Values, Context>,
	selector?: (state: AtlFormState<Values>) => Selected,
) => {
	const resolvedForm = useResolvedForm(form);
	const version = useSyncExternalStore(
		resolvedForm.subscribeForm,
		resolvedForm.getFormStateVersion,
		resolvedForm.getFormStateVersion,
	);
	void version;
	const snapshot = resolvedForm.getFormState();

	return selector ? selector(snapshot) : (snapshot as Selected);
};
