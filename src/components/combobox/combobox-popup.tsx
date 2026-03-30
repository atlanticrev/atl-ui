import type { RefObject, ReactNode } from 'react';

import { AtlDropdown } from '@/components/dropdown';
import { AtlPopup } from '@/components/popup';

import type { ComboboxOption } from './types';

type ComboboxPopupProps<T> = {
	anchorRef: RefObject<HTMLDivElement | null>;
	emptyState: ReactNode;
	flip: boolean;
	headerSlot?: ReactNode;
	highlightedIndex: number;
	id?: string;
	inputRootRef: RefObject<HTMLLabelElement | null>;
	isOpen: boolean;
	items: ComboboxOption<T>[];
	maxHeight: number;
	multiSelect?: boolean;
	onClose: () => void;
	onSelect: (value: T) => void;
	onSelectAll?: () => void;
	optionIdPrefix: string;
	selectedValues: T[];
	showFooter?: boolean;
	footerText?: string;
	selectAllText?: string;
	testId: string;
};

export const ComboboxPopup = <T,>({
	anchorRef,
	emptyState,
	flip,
	footerText,
	headerSlot,
	highlightedIndex,
	id,
	inputRootRef,
	isOpen,
	items,
	maxHeight,
	multiSelect = false,
	onClose,
	onSelect,
	onSelectAll,
	optionIdPrefix,
	selectedValues,
	selectAllText,
	showFooter = false,
	testId,
}: ComboboxPopupProps<T>): JSX.Element => {
	return (
		<AtlPopup anchorRef={anchorRef} flip={flip} inputRootRef={inputRootRef} isOpen={isOpen} testId={`${testId}-popup`} onClose={onClose}>
			<AtlDropdown
				emptyState={emptyState}
				footerText={footerText}
				headerSlot={headerSlot}
				highlightedIndex={highlightedIndex}
				id={id}
				items={items}
				maxHeight={maxHeight}
				multiSelect={multiSelect}
				optionIdPrefix={optionIdPrefix}
				selectAllText={selectAllText}
				selectedValues={selectedValues}
				showFooter={showFooter}
				testId={`${testId}-dropdown-list`}
				onSelect={onSelect}
				onSelectAll={onSelectAll}
			/>
		</AtlPopup>
	);
};
