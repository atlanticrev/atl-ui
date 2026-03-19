import { useEffect } from 'react';
import type { RefObject } from 'react';

type ElementRef = RefObject<HTMLElement | null>;

type UseClickOutsideParameters = {
	enabled?: boolean;
	onOutsideClick: () => void;
	refs: ElementRef[];
};

export const useClickOutside = ({
	enabled = true,
	onOutsideClick,
	refs,
}: UseClickOutsideParameters): void => {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handlePointerDown = (event: MouseEvent | TouchEvent) => {
			const targetNode = event.target;

			if (!(targetNode instanceof Node)) {
				return;
			}

			const isInside = refs.some((ref) => ref.current?.contains(targetNode));

			if (!isInside) {
				onOutsideClick();
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('touchstart', handlePointerDown);

		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('touchstart', handlePointerDown);
		};
	}, [enabled, onOutsideClick, refs]);
};
