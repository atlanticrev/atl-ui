import type { ComboboxOption } from '@/components/combobox/types';
import type { AtlInputProps } from '@/components/input/input.type';

export type SelectOption<T = string> = ComboboxOption<T>;

type SelectBaseProps = Pick<
	AtlInputProps,
	'className' | 'disabled' | 'helperText' | 'label' | 'placeholder' | 'size' | 'status'
>;

type SelectCommonProps<T> = SelectBaseProps & {
	filterFn?: (option: SelectOption<T>, searchValue: string) => boolean;
	flip?: boolean;
	footerText?: string;
	maxDropdownHeight?: number;
	multiSelect?: boolean;
	noResultsText?: string;
	onSelectAll?: () => void;
	options: SelectOption<T>[];
	searchPlaceholder?: string;
	searchable?: boolean;
	selectAllText?: string;
	showFooter?: boolean;
	testId: string;
};

type SelectSingleProps<T> = {
	multiSelect?: false;
	onChange?: (value: T) => void;
	value?: T;
};

type SelectMultiProps<T> = {
	multiSelect: true;
	onChange?: (values: T[]) => void;
	value?: T[];
};

export type AtlSelectProps<T = string> = SelectCommonProps<T> & (SelectSingleProps<T> | SelectMultiProps<T>);
