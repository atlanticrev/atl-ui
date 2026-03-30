import type { RefObject } from 'react';

import { useClickOutside } from './use-click-outside';
import { useKeyPress } from './use-key-press';

type UseOverlayDismissParameters = {
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
	enabled?: boolean;
	onClose: () => void;
	refs: RefObject<HTMLElement | null>[];
};

export const useOverlayDismiss = ({
	closeOnEscape = true,
	closeOnOutsideClick = true,
	enabled = true,
	onClose,
	refs,
}: UseOverlayDismissParameters): void => {
	useClickOutside({
		enabled: enabled && closeOnOutsideClick,
		onOutsideClick: onClose,
		refs,
	});
	useKeyPress({
		enabled: enabled && closeOnEscape,
		key: 'Escape',
		onKeyPress: onClose,
	});
};
