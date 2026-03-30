import { useCallback, useMemo } from 'react';

import type { SelectOption } from './types';

export const useSelectValue = <T,>({
	multiSelect,
	onChange,
	options,
	value,
}: {
	multiSelect: boolean;
	onChange?: ((value: T) => void) | ((values: T[]) => void);
	options: SelectOption<T>[];
	value?: T | T[];
}) => {
	const selectedValues = useMemo(() => {
		if (multiSelect) {
			return (value as T[] | undefined) ?? [];
		}

		return value === undefined ? [] : [value as T];
	}, [multiSelect, value]);
	const selectedOption = useMemo(() => {
		return multiSelect ? undefined : options.find((option) => option.value === value);
	}, [multiSelect, options, value]);
	const displayValue = useMemo(() => {
		if (multiSelect) {
			return selectedValues.length > 0 ? `${selectedValues.length} selected` : '';
		}

		return selectedOption?.label ?? '';
	}, [multiSelect, selectedOption, selectedValues.length]);
	const handleSelectValue = useCallback((selected: T) => {
		if (multiSelect) {
			const currentValues = (value as T[] | undefined) ?? [];
			const nextValues = currentValues.includes(selected)
				? currentValues.filter((item) => item !== selected)
				: [...currentValues, selected];
			(onChange as ((values: T[]) => void) | undefined)?.(nextValues);
			return false;
		}

		(onChange as ((nextValue: T) => void) | undefined)?.(selected);
		return true;
	}, [multiSelect, onChange, value]);

	return {
		displayValue,
		handleSelectValue,
		selectedOption,
		selectedValues,
	};
};
