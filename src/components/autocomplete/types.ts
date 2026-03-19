import type { ComboboxOption } from '@/components/combobox/types';
import type { AtlInputProps } from '@/components/input/input.type';

export type AutocompleteOption<T = string> = ComboboxOption<T>;

type AutocompleteBaseProps = Pick<
	AtlInputProps,
	'className' | 'disabled' | 'helperText' | 'label' | 'placeholder' | 'size' | 'status'
>;

export type AtlAutocompleteProps<T = string> = AutocompleteBaseProps & {
	filterFn?: (option: AutocompleteOption<T>, searchValue: string) => boolean;
	flip?: boolean;
	inputPattern?: RegExp;
	maxDropdownHeight?: number;
	noResultsIcon?: React.ReactNode;
	noResultsText?: string;
	onChange: (value: T) => void;
	options: AutocompleteOption<T>[];
	searchPlaceholder?: string;
	showDescription?: boolean;
	testId: string;
	value?: T;
};
