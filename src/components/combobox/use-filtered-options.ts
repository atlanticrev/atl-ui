import { useMemo } from 'react';

import { defaultComboboxFilter } from './default-filter';
import type { ComboboxOption } from './types';

export const useFilteredOptions = <T,>({
	filterFn,
	options,
	searchValue,
}: {
	filterFn?: (option: ComboboxOption<T>, searchValue: string) => boolean;
	options: ComboboxOption<T>[];
	searchValue: string;
}) => {
	return useMemo(() => {
		if (!searchValue.trim()) {
			return options;
		}

		const runFilter = filterFn ?? defaultComboboxFilter;
		return options.filter((option) => runFilter(option, searchValue));
	}, [filterFn, options, searchValue]);
};
