'use client';

import type { KeyboardEvent, MouseEvent } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { Button } from '@/components/button';
import { Dropdown } from '@/components/dropdown';
import { clsx } from '@/lib/clsx';

type SelectOption = {
	value: string;
	label: string;
};

type SelectProps = {
	label: string;
	value: string;
	options: SelectOption[];
	onChange: (value: string) => void;
	helper?: string;
	className?: string;
	dropdownOffset?: number;
};

const DEFAULT_DROPDOWN_OFFSET = 10;
const DEFAULT_MOBILE_BREAKPOINT = 960;

export function Select({ label, value, options, onChange, helper, className, dropdownOffset }: SelectProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

	const labelId = useId();
	const listId = useId();

	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const optionsRef = useRef<HTMLDivElement | null>(null);
	const focusRafRef = useRef<number | null>(null);
	const focusAttemptsRef = useRef(0);

	const selectedIndex = options.findIndex((option) => option.value === value);

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const focusOptions = useCallback(() => {
		if (focusRafRef.current) {
			window.cancelAnimationFrame(focusRafRef.current);
		}

		focusRafRef.current = window.requestAnimationFrame(() => {
			if (optionsRef.current) {
				try {
					optionsRef.current.focus({ preventScroll: true });
				} catch {
					optionsRef.current.focus();
				}
				focusAttemptsRef.current = 0;
				focusRafRef.current = null;
				return;
			}

			focusAttemptsRef.current += 1;
			if (focusAttemptsRef.current < 6) {
				focusOptions();
				return;
			}

			focusAttemptsRef.current = 0;
			focusRafRef.current = null;
		});
	}, []);

	const focusTrigger = () => {
		anchorRef.current?.focus();
	};

	const ensureHighlight = useCallback(() => {
		if (selectedIndex >= 0) {
			setHighlightedIndex(selectedIndex);
			return;
		}

		if (options.length > 0) {
			setHighlightedIndex(0);
		}
	}, [options.length, selectedIndex]);

	const closeAndResetHighlight = () => {
		setIsOpen(false);
		setHighlightedIndex(null);
		focusTrigger();
	};

	useEffect(() => {
		if (isOpen) {
			ensureHighlight();
			focusOptions();
		} else {
			setHighlightedIndex(null);
			if (focusRafRef.current) {
				window.cancelAnimationFrame(focusRafRef.current);
				focusRafRef.current = null;
			}
			focusAttemptsRef.current = 0;
		}
	}, [isOpen, ensureHighlight, focusOptions]);

	const handleOptionClick = (event: MouseEvent<HTMLButtonElement>) => {
		const optionValue = event.currentTarget.dataset.value;
		if (!optionValue) {
			return;
		}

		if (optionValue !== value) {
			onChange(optionValue);
		}

		setIsOpen(false);
	};

	const handleOptionSelect = (index: number) => {
		const option = options[index];

		if (!option) {
			return;
		}

		if (option.value !== value) {
			onChange(option.value);
		}

		closeAndResetHighlight();
	};

	const getNextIndex = (direction: 'next' | 'prev') => {
		if (options.length === 0) {
			return null;
		}

		const baseIndex = highlightedIndex ?? (selectedIndex >= 0 ? selectedIndex : 0);
		const delta = direction === 'next' ? 1 : -1;
		const nextIndex = baseIndex + delta;

		if (nextIndex >= options.length) {
			return 0;
		}

		if (nextIndex < 0) {
			return options.length - 1;
		}

		return nextIndex;
	};

	const moveHighlight = (direction: 'next' | 'prev') => {
		const nextIndex = getNextIndex(direction);
		if (nextIndex === null) {
			return;
		}

		setHighlightedIndex(nextIndex);
	};

	const handleArrowNavigation = (direction: 'next' | 'prev') => {
		if (!isOpen) {
			setIsOpen(true);
			ensureHighlight();
		}

		moveHighlight(direction);
		focusOptions();
	};

	const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			setIsOpen((prev) => !prev);
		}

		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			handleArrowNavigation(event.key === 'ArrowDown' ? 'next' : 'prev');
		}
	};

	const handleOptionsKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			moveHighlight('next');
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			moveHighlight('prev');
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			if (highlightedIndex !== null) {
				handleOptionSelect(highlightedIndex);
			}
		}

		if (event.key === 'Escape') {
			event.preventDefault();
			closeAndResetHighlight();
		}

		if (event.key === 'Tab') {
			closeAndResetHighlight();
		}
	};

	const getOptionClasses = (optionValue: string) => {
		const isActive = optionValue === value;
		return clsx('ui-select__option', isActive && 'ui-select__option--active');
	};

	const getOptionAriaSelected = (optionValue: string) => optionValue === value;

	const getOptionId = (index: number) => `${listId}-option-${index}`;

	const renderOption = (option: SelectOption, index: number) => {
		const optionClasses = getOptionClasses(option.value);
		const isSelected = getOptionAriaSelected(option.value);
		const isHighlighted = highlightedIndex === index;
		const classes = clsx(optionClasses, isHighlighted && 'ui-select__option--highlighted');

		return (
			<Button
				aria-selected={isSelected}
				className={classes}
				data-value={option.value}
				id={getOptionId(index)}
				key={option.value}
				onClick={handleOptionClick}
				role="option"
				tabIndex={-1}
				type="button"
				disableMotion
				variant="ghost"
			>
				{option.label}
			</Button>
		);
	};

	const classes = clsx('ui-select', className);
	const selectedOption = options.find((option) => option.value === value) ?? options[0];

	return (
		<div className={classes}>
			<span
				className="ui-select__label"
				id={labelId}
			>
				{label}
			</span>

			<Button
				aria-controls={listId}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-labelledby={labelId}
				className="ui-select__trigger"
				onClick={handleToggle}
				onKeyDown={handleTriggerKeyDown}
				ref={anchorRef}
				type="button"
				disableMotion
				variant="ghost"
			>
				<span className="ui-select__value">{selectedOption?.label ?? label}</span>

				<span className="ui-select__icon" />
			</Button>

			<Dropdown
				anchorRef={anchorRef}
				className="ui-select__dropdown"
				isOpen={isOpen}
				mode="auto"
				mobileBreakpoint={DEFAULT_MOBILE_BREAKPOINT}
				offset={dropdownOffset ?? DEFAULT_DROPDOWN_OFFSET}
				onClose={handleClose}
			>
				<div
					aria-activedescendant={highlightedIndex !== null ? getOptionId(highlightedIndex) : undefined}
					aria-labelledby={labelId}
					className="ui-select__options"
					id={listId}
					onKeyDown={handleOptionsKeyDown}
					ref={optionsRef}
					role="listbox"
					tabIndex={-1}
				>
					{options.map(renderOption)}
				</div>
			</Dropdown>

			{helper ? <span className="ui-select__helper">{helper}</span> : null}
		</div>
	);
}
