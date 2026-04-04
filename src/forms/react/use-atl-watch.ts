import { useMemo, useSyncExternalStore } from 'react';

import { useResolvedForm } from './use-resolved-form';

import type { AtlFormStore, AtlFormValues } from '../core/types';

type WatchValue = Record<string, unknown> | unknown;

const getWatchSnapshot = <Values extends AtlFormValues, Context = unknown>(
	form: AtlFormStore<Values, Context>,
	names?: string[],
): WatchValue => {
	if (!names || names.length === 0) {
		return form.getValues();
	}

	if (names.length === 1) {
		return form.getValue(names[0]);
	}

	return Object.fromEntries(names.map((name) => [name, form.getValue(name)]));
};

export const useAtlWatch = <Values extends AtlFormValues, Context = unknown>(
	nameOrNames?: string | string[],
	form?: AtlFormStore<Values, Context>,
) => {
	const resolvedForm = useResolvedForm(form);
	const names = useMemo(() => {
		if (!nameOrNames) {
			return undefined;
		}

		return Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames];
	}, [nameOrNames]);

	const version = useSyncExternalStore(
		(listener) => resolvedForm.subscribeWatch(names, listener),
		resolvedForm.getWatchStateVersion,
		resolvedForm.getWatchStateVersion,
	);
	void version;
	return getWatchSnapshot(resolvedForm, names);
};
