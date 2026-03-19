import { useEffect } from 'react';
import type { RefObject } from 'react';

type UseKeyPressParameters = {
	elementRef?: RefObject<HTMLElement | null>;
	enabled?: boolean;
	key: string;
	onKeyPress: () => void;
	preventDefault?: boolean;
};

export const useKeyPress = ({
	elementRef,
	enabled = true,
	key,
	onKeyPress,
	preventDefault = false,
}: UseKeyPressParameters): void => {
	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			const activeElement = document.activeElement;
			const matchesTarget = !elementRef?.current || activeElement === elementRef.current;

			if (!matchesTarget || event.key !== key) {
				return;
			}

			if (preventDefault) {
				event.preventDefault();
			}

			onKeyPress();
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [elementRef, enabled, key, onKeyPress, preventDefault]);
};
