import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { ComboboxPopup } from '@/components/combobox/combobox-popup';
import { useComboboxRefs } from '@/components/combobox/use-combobox-refs';
import { useDropdownState } from '@/components/combobox/use-dropdown-state';
import { useFilteredOptions } from '@/components/combobox/use-filtered-options';
import { useKeyboardNavigation } from '@/components/combobox/use-keyboard-navigation';
import { AtlInput } from '@/components/input/input';
import { ChevronDownIcon } from '@/icons/chevron-down-icon';
import { SearchIcon } from '@/icons/search-icon';

import type { AtlSelectProps } from './types';
import { useSelectValue } from './use-select-value';

const DEFAULT_MAX_HEIGHT = 212;

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
	const { anchorRef, inputRef, inputRootRef } = useComboboxRefs();
	const dropdown = useDropdownState(disabled);
	const filteredOptions = useFilteredOptions({
		filterFn: searchable ? filterFn : undefined,
		options,
		searchValue: searchable ? searchValue : '',
	});
	const { displayValue, handleSelectValue, selectedOption, selectedValues } = useSelectValue({
		multiSelect,
		onChange,
		options,
		value,
	});
	const initialHighlightIndex = useMemo(() => {
		return filteredOptions.findIndex((option) => selectedValues.includes(option.value));
	}, [filteredOptions, selectedValues]);
	const { handleKeyDown, highlightedIndex } = useKeyboardNavigation({
		initialHighlightIndex,
		inputRef,
		isOpen: dropdown.isOpen,
		onClose: dropdown.close,
		onOpen: dropdown.open,
		onSelect: (selected) => {
			const shouldClose = handleSelectValue(selected);

			if (shouldClose) {
				dropdown.close();
			}
		},
		options: filteredOptions,
	});

	const handleTriggerMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		dropdown.toggle();
		requestAnimationFrame(() => inputRef.current?.focus());
	}, [dropdown, inputRef]);
	const handleSelect = useCallback((selected: T) => {
		const shouldClose = handleSelectValue(selected);

		if (shouldClose) {
			dropdown.close();
		}
	}, [dropdown, handleSelectValue]);
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
			<ComboboxPopup
				anchorRef={anchorRef}
				emptyState={<span>{noResultsText}</span>}
				flip={flip}
				footerText={footerText}
				headerSlot={dropdownHeader}
				highlightedIndex={highlightedIndex}
				inputRootRef={inputRootRef}
				isOpen={dropdown.isOpen}
				items={filteredOptions}
				maxHeight={maxDropdownHeight}
				multiSelect={multiSelect}
				onClose={dropdown.close}
				onSelect={handleSelect}
				onSelectAll={onSelectAll}
				optionIdPrefix={`${testId}-option`}
				selectedValues={selectedValues}
				selectAllText={selectAllText}
				showFooter={showFooter}
				testId={testId}
			/>
		</div>
	);
};
