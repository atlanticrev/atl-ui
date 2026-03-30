import type { ComboboxOption } from './types';

export const defaultComboboxFilter = <T,>(option: ComboboxOption<T>, searchValue: string): boolean => {
	return option.label.toLowerCase().includes(searchValue.toLowerCase());
};
