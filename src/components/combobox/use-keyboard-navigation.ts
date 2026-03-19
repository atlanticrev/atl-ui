import type { KeyboardEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { UseKeyboardNavigationParameters } from './types';

export const useKeyboardNavigation = <T,>({
	initialHighlightIndex,
	inputRef,
	isOpen,
	onClose,
	onOpen,
	onSelect,
	options,
}: UseKeyboardNavigationParameters<T>) => {
	const [highlightedIndex, setHighlightedIndex] = useState(initialHighlightIndex);
	const enabledIndices = useMemo(
		() => options.map((option, index) => (!option.disabled ? index : -1)).filter((index) => index >= 0),
		[options],
	);

	const moveHighlight = useCallback(
		(direction: 'next' | 'prev' | 'first' | 'last') => {
			if (enabledIndices.length === 0) {
				return;
			}

			setHighlightedIndex((current) => {
				const currentPosition = enabledIndices.indexOf(current);

				if (direction === 'first') {
					return enabledIndices[0];
				}

				if (direction === 'last') {
					return enabledIndices[enabledIndices.length - 1];
				}

				if (direction === 'next') {
					return currentPosition < 0 || currentPosition === enabledIndices.length - 1
						? enabledIndices[0]
						: enabledIndices[currentPosition + 1];
				}

				return currentPosition <= 0 ? enabledIndices[enabledIndices.length - 1] : enabledIndices[currentPosition - 1];
			});
		},
		[enabledIndices],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<Element>) => {
			switch (event.key) {
				case 'Enter':
					event.preventDefault();
					if (!isOpen) {
						onOpen();
					} else if (highlightedIndex >= 0 && options[highlightedIndex]) {
						onSelect(options[highlightedIndex].value);
					}
					break;
				case 'Escape':
					event.preventDefault();
					onClose();
					inputRef.current?.focus();
					break;
				case 'ArrowDown':
					event.preventDefault();
					if (!isOpen) {
						onOpen();
					} else {
						moveHighlight('next');
					}
					break;
				case 'ArrowUp':
					event.preventDefault();
					if (!isOpen) {
						onOpen();
					} else {
						moveHighlight('prev');
					}
					break;
				case 'Home':
					if (isOpen) {
						event.preventDefault();
						moveHighlight('first');
					}
					break;
				case 'End':
					if (isOpen) {
						event.preventDefault();
						moveHighlight('last');
					}
					break;
				case 'Tab':
					if (isOpen) {
						onClose();
					}
					break;
				default:
					break;
			}
		},
		[highlightedIndex, inputRef, isOpen, moveHighlight, onClose, onOpen, onSelect, options],
	);

	return {
		handleKeyDown,
		highlightedIndex,
		setHighlightedIndex,
	};
};
