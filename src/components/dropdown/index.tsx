import { useCallback, useEffect, useMemo, useRef } from 'react';

import { CheckIcon } from '@/icons/check-icon';
import { clsx } from '@/lib/clsx';

import type { AtlDropdownProps } from './types';

const DEFAULT_MAX_HEIGHT = 212;

export const AtlDropdown = <T,>({
	className,
	emptyState,
	footerText,
	headerSlot,
	highlightedIndex = -1,
	id,
	items,
	maxHeight = DEFAULT_MAX_HEIGHT,
	multiSelect = false,
	onSelect,
	onSelectAll,
	optionIdPrefix,
	selectAllText = 'Select all',
	selectedValues = [],
	showFooter = false,
	testId,
}: AtlDropdownProps<T>): JSX.Element => {
	const listRef = useRef<HTMLDivElement>(null);
	const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
	const showEmptyState = items.length === 0 && emptyState;

	useEffect(() => {
		if (!listRef.current) {
			return;
		}

		const selector = highlightedIndex >= 0 ? '[data-highlighted="true"]' : '[data-selected="true"]';
		listRef.current.querySelector(selector)?.scrollIntoView({ block: 'nearest' });
	}, [highlightedIndex]);

	const handleSelectAll = useCallback(() => onSelectAll?.(), [onSelectAll]);

	return (
		<div className={clsx('atl-dropdown-list', className)} data-testid={testId}>
			{headerSlot}
			<div className="atl-dropdown-list__main" id={id} role="listbox">
				{showEmptyState ? (
					<div className="atl-dropdown-list__empty" role="option" tabIndex={-1}>
						{emptyState}
					</div>
				) : (
					<div className="atl-dropdown-list__items" ref={listRef} style={{ maxHeight }}>
						{items.map((item, index) => {
							const isSelected = selectedSet.has(item.value);
							const isHighlighted = index === highlightedIndex;
							const optionId = optionIdPrefix ? `${optionIdPrefix}-${index}` : undefined;

							return (
								<button
									aria-disabled={item.disabled || undefined}
									aria-selected={isSelected}
									className={clsx(
										'atl-dropdown-list__item',
										isSelected && 'atl-dropdown-list__item--selected',
										isHighlighted && 'atl-dropdown-list__item--highlighted',
										item.disabled && 'atl-dropdown-list__item--disabled',
									)}
									data-highlighted={isHighlighted || undefined}
									data-selected={isSelected || undefined}
									data-testid={`${testId}-item-${String(item.value)}`}
									id={optionId}
									key={String(item.value)}
									role="option"
									tabIndex={-1}
									type="button"
									onClick={() => !item.disabled && onSelect?.(item.value)}
								>
									{item.icon && <span className="atl-dropdown-list__item-icon">{item.icon}</span>}
									<span className="atl-dropdown-list__item-text">
										<span className="atl-dropdown-list__item-label">{item.label}</span>
										{item.description && (
											<span className="atl-dropdown-list__item-description">{item.description}</span>
										)}
									</span>
									{isSelected && (
										<span className="atl-dropdown-list__item-checkmark">
											<CheckIcon size={24} />
										</span>
									)}
								</button>
							);
						})}
					</div>
				)}
			</div>
			{showFooter && (
				<div className="atl-dropdown-list__footer">
					{footerText && <span className="atl-dropdown-list__footer-text">{footerText}</span>}
					{multiSelect && onSelectAll && (
						<button className="atl-dropdown-list__select-all" type="button" onClick={handleSelectAll}>
							{selectAllText}
						</button>
					)}
				</div>
			)}
		</div>
	);
};
