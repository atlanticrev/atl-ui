import { useCallback, useState } from 'react';

import type { UseDropdownStateResult } from './types';

export const useDropdownState = (disabled = false): UseDropdownStateResult => {
	const [isOpen, setIsOpen] = useState(false);
	const open = useCallback(() => {
		if (!disabled) {
			setIsOpen(true);
		}
	}, [disabled]);
	const close = useCallback(() => setIsOpen(false), []);
	const toggle = useCallback(() => {
		if (isOpen) {
			close();
			return;
		}

		open();
	}, [close, isOpen, open]);

	return {
		close,
		isOpen,
		open,
		toggle,
	};
};
