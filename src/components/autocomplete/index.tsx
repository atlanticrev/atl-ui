import { useCallback, useEffect, useMemo, useState } from 'react';

import { ComboboxPopup } from '@/components/combobox/combobox-popup';
import { useComboboxRefs } from '@/components/combobox/use-combobox-refs';
import { useDropdownState } from '@/components/combobox/use-dropdown-state';
import { useFilteredOptions } from '@/components/combobox/use-filtered-options';
import { useKeyboardNavigation } from '@/components/combobox/use-keyboard-navigation';
import { AtlInput } from '@/components/input/input';
import { ChevronDownIcon } from '@/icons/chevron-down-icon';
import { SearchIcon } from '@/icons/search-icon';

import type { AtlAutocompleteProps } from './types';

const DEFAULT_MAX_HEIGHT = 212;

export const AtlAutocomplete = <T,>({
	className,
	disabled = false,
	filterFn,
	flip = false,
	helperText,
	inputPattern,
	label,
	maxDropdownHeight = DEFAULT_MAX_HEIGHT,
	noResultsIcon,
	noResultsText = 'No results found',
	onChange,
	options,
	placeholder,
	searchPlaceholder,
	showDescription = true,
	size = 'm',
	status = 'default',
	testId,
	value,
}: AtlAutocompleteProps<T>): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const { anchorRef, inputRef, inputRootRef } = useComboboxRefs();
	const dropdown = useDropdownState(disabled);
	const selectedOption = useMemo(() => options.find((option) => option.value === value), [options, value]);
	const filteredOptions = useFilteredOptions({
		filterFn,
		options,
		searchValue,
	});
	const displayValue = isTyping ? searchValue : selectedOption?.label ?? '';
	const initialHighlightIndex = useMemo(() => {
		return filteredOptions.findIndex((option) => option.value === value);
	}, [filteredOptions, value]);
	const { handleKeyDown, highlightedIndex, setHighlightedIndex } = useKeyboardNavigation({
		initialHighlightIndex,
		inputRef,
		isOpen: dropdown.isOpen,
		onClose: dropdown.close,
		onOpen: dropdown.open,
		onSelect: (selected) => {
			onChange(selected);
			setSearchValue('');
			setIsTyping(false);
			dropdown.close();
			requestAnimationFrame(() => inputRef.current?.blur());
		},
		options: filteredOptions,
	});

	useEffect(() => {
		if (!dropdown.isOpen) {
			setIsTyping(false);
			setSearchValue('');
			setHighlightedIndex(-1);
		}
	}, [dropdown.isOpen, setHighlightedIndex]);

	const handleInputChange = useCallback((nextValue: string) => {
		if (inputPattern && nextValue !== '' && !inputPattern.test(nextValue)) {
			return;
		}

		setSearchValue(nextValue);
		setIsTyping(true);
		dropdown.open();
	}, [dropdown, inputPattern]);
	const handleInputFocus = useCallback(() => dropdown.open(), [dropdown]);
	const handleInputBlur = useCallback(() => {
		window.setTimeout(() => {
			if (!dropdown.isOpen) {
				setSearchValue('');
				setIsTyping(false);
			}
		}, 120);
	}, [dropdown.isOpen]);
	const handleSelect = useCallback((selected: T) => {
		onChange(selected);
		setSearchValue('');
		setIsTyping(false);
		dropdown.close();
	}, [dropdown, onChange]);
	const activeDescendant = highlightedIndex >= 0 ? `${testId}-option-${highlightedIndex}` : undefined;
	const emptyState = (
		<span className="atl-autocomplete__empty-state">
			{noResultsIcon ?? <SearchIcon />}
			<span>{noResultsText}</span>
		</span>
	);

	return (
		<div className={className}>
			<div className="atl-autocomplete" ref={anchorRef}>
				<AtlInput
					ref={inputRef}
					aria-activedescendant={activeDescendant}
					aria-autocomplete="list"
					aria-controls={`${testId}-listbox`}
					aria-expanded={dropdown.isOpen}
					className="atl-autocomplete__input"
					description={!isTyping && showDescription ? selectedOption?.description : undefined}
					disabled={disabled}
					helperText={helperText}
					iconLeft={selectedOption?.icon}
					iconRight={<ChevronDownIcon size={24} />}
					iconRightRotated={dropdown.isOpen}
					label={label}
					onKeyDown={handleKeyDown}
					placeholder={isTyping ? searchPlaceholder : placeholder}
					rootRef={inputRootRef}
					role="combobox"
					size={size}
					status={status}
					testId={`${testId}-input`}
					value={displayValue}
					onBlur={handleInputBlur}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
				/>
			</div>

			<ComboboxPopup
				anchorRef={anchorRef}
				emptyState={emptyState}
				flip={flip}
				highlightedIndex={highlightedIndex}
				id={`${testId}-listbox`}
				inputRootRef={inputRootRef}
				isOpen={dropdown.isOpen}
				items={filteredOptions}
				maxHeight={maxDropdownHeight}
				onClose={dropdown.close}
				onSelect={handleSelect}
				optionIdPrefix={`${testId}-option`}
				selectedValues={value === undefined ? [] : [value]}
				testId={testId}
			/>
		</div>
	);
};
