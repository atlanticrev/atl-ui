import { useCallback, useMemo, useState } from 'react';

type UseOverlayStateParameters = {
	defaultOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	open?: boolean;
};

export const useOverlayState = ({ defaultOpen = false, onOpenChange, open }: UseOverlayStateParameters) => {
	const [internalOpen, setInternalOpen] = useState(defaultOpen);
	const isControlled = open !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setOpen = useCallback((nextOpen: boolean) => {
		if (!isControlled) {
			setInternalOpen(nextOpen);
		}

		onOpenChange?.(nextOpen);
	}, [isControlled, onOpenChange]);
	const openOverlay = useCallback(() => setOpen(true), [setOpen]);
	const closeOverlay = useCallback(() => setOpen(false), [setOpen]);
	const toggleOverlay = useCallback(() => setOpen(!isOpen), [isOpen, setOpen]);

	return useMemo(() => ({ closeOverlay, isOpen, openOverlay, setOpen, toggleOverlay }), [closeOverlay, isOpen, openOverlay, setOpen, toggleOverlay]);
};
