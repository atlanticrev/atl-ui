import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useDropdownState } from '@/components/combobox/use-dropdown-state';
import { useKeyboardNavigation } from '@/components/combobox/use-keyboard-navigation';
import { AtlDropdown } from '@/components/dropdown';
import { AtlInput } from '@/components/input/input';
import { AtlPopup } from '@/components/popup';
import { ChevronDownIcon } from '@/icons/chevron-down-icon';
import { SearchIcon } from '@/icons/search-icon';

import type { AtlSelectProps, SelectOption } from './types';

const DEFAULT_MAX_HEIGHT = 212;

const defaultFilter = <T,>(option: SelectOption<T>, searchValue: string): boolean => {
	return option.label.toLowerCase().includes(searchValue.toLowerCase());
};

export const AtlSelect = <T,>({
	className,
	disabled = false,
	filterFn,
	flip = true,
	footerText,
	helperText,
	label,
	maxDropdownHeight = DEFAULT_MAX_HEIGHT,
	multiSelect = false,
	noResultsText = 'No results found',
	onChange,
	onSelectAll,
	options,
	placeholder,
	searchPlaceholder,
	searchable = false,
	selectAllText = 'Select all',
	showFooter = false,
	size = 'm',
	status = 'default',
	testId,
	value,
}: AtlSelectProps<T>): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);
	const inputRootRef = useRef<HTMLLabelElement>(null);
	const dropdown = useDropdownState(disabled);
	const filteredOptions = useMemo(() => {
		if (!searchable || !searchValue.trim()) {
			return options;
		}

		const runFilter = filterFn ?? defaultFilter;
		return options.filter((option) => runFilter(option, searchValue));
	}, [filterFn, options, searchValue, searchable]);
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
	const initialHighlightIndex = filteredOptions.findIndex((option) => selectedValues.includes(option.value));
	const { handleKeyDown, highlightedIndex } = useKeyboardNavigation({
		initialHighlightIndex,
		inputRef,
		isOpen: dropdown.isOpen,
		onClose: dropdown.close,
		onOpen: dropdown.open,
		onSelect: (selected) => {
			if (multiSelect) {
				const currentValues = (value as T[] | undefined) ?? [];
				const nextValues = currentValues.includes(selected)
					? currentValues.filter((item) => item !== selected)
					: [...currentValues, selected];
				(onChange as ((values: T[]) => void) | undefined)?.(nextValues);
				return;
			}

			(onChange as ((nextValue: T) => void) | undefined)?.(selected);
			dropdown.close();
		},
		options: filteredOptions,
	});

	const handleTriggerMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		dropdown.toggle();
		requestAnimationFrame(() => inputRef.current?.focus());
	}, [dropdown]);
	const handleSelect = useCallback((selected: T) => {
		if (multiSelect) {
			const currentValues = (value as T[] | undefined) ?? [];
			const nextValues = currentValues.includes(selected)
				? currentValues.filter((item) => item !== selected)
				: [...currentValues, selected];
			(onChange as ((values: T[]) => void) | undefined)?.(nextValues);
			return;
		}

		(onChange as ((nextValue: T) => void) | undefined)?.(selected);
		dropdown.close();
	}, [dropdown, multiSelect, onChange, value]);
	const handleSearchKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
		event.stopPropagation();
		handleKeyDown(event);
	}, [handleKeyDown]);
	const dropdownHeader = searchable ? (
		<div className="atl-select__search">
			<AtlInput
				autoFocus
				className="atl-select__search-input"
				iconLeft={<SearchIcon />}
				placeholder={searchPlaceholder}
				size="xs"
				value={searchValue}
				onChange={setSearchValue}
				onKeyDown={handleSearchKeyDown}
			/>
		</div>
	) : undefined;
	const emptyState = <span>{noResultsText}</span>;

	return (
		<div className={className}>
			<div className="atl-select" ref={anchorRef}>
				<AtlInput
					ref={inputRef}
					className="atl-select__input"
					disabled={disabled}
					helperText={helperText}
					iconLeft={selectedOption?.icon}
					iconRight={<ChevronDownIcon size={24} />}
					iconRightRotated={dropdown.isOpen}
					label={label}
					onKeyDown={handleKeyDown}
					onMouseDown={handleTriggerMouseDown}
					placeholder={placeholder}
					readOnly
					readOnlyStyled={false}
					rootRef={inputRootRef}
					size={size}
					status={status}
					testId={`${testId}-input`}
					value={displayValue}
				/>
			</div>
			<AtlPopup anchorRef={anchorRef} flip={flip} inputRootRef={inputRootRef} isOpen={dropdown.isOpen} testId={`${testId}-popup`} onClose={dropdown.close}>
				<AtlDropdown
					emptyState={emptyState}
					footerText={footerText}
					headerSlot={dropdownHeader}
					highlightedIndex={highlightedIndex}
					items={filteredOptions}
					maxHeight={maxDropdownHeight}
					multiSelect={multiSelect}
					optionIdPrefix={`${testId}-option`}
					selectAllText={selectAllText}
					selectedValues={selectedValues}
					showFooter={showFooter}
					testId={`${testId}-dropdown-list`}
					onSelect={handleSelect}
					onSelectAll={onSelectAll}
				/>
			</AtlPopup>
		</div>
	);
};
