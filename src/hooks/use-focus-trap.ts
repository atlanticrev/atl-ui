import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'button:not([disabled])',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

type UseFocusTrapParameters = {
	enabled?: boolean;
	rootRef: RefObject<HTMLElement | null>;
};

export const useFocusTrap = ({
	enabled = true,
	rootRef,
}: UseFocusTrapParameters): void => {
	useEffect(() => {
		if (!enabled || !rootRef.current) {
			return;
		}

		const rootNode = rootRef.current;
		const previousActiveElement = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null;
		const focusableElements = Array.from(rootNode.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
		const firstElement = focusableElements[0] ?? rootNode;
		const lastElement = focusableElements[focusableElements.length - 1] ?? rootNode;

		firstElement.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key !== 'Tab') {
				return;
			}

			const activeElement = document.activeElement;

			if (event.shiftKey && activeElement === firstElement) {
				event.preventDefault();
				lastElement.focus();
				return;
			}

			if (!event.shiftKey && activeElement === lastElement) {
				event.preventDefault();
				firstElement.focus();
			}
		};

		rootNode.addEventListener('keydown', handleKeyDown);

		return () => {
			rootNode.removeEventListener('keydown', handleKeyDown);
			previousActiveElement?.focus();
		};
	}, [enabled, rootRef]);
};
