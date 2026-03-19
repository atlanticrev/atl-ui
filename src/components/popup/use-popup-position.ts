import { useLayoutEffect, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';

type UsePopupPositionParameters = {
	anchorRef: RefObject<HTMLElement | null>;
	flip: boolean;
	gap: number;
	inputRootRef?: RefObject<HTMLElement | null>;
	isOpen: boolean;
	popupRef: RefObject<HTMLDivElement | null>;
};

const VIEWPORT_PADDING = 8;

export const usePopupPosition = ({
	anchorRef,
	flip,
	gap,
	inputRootRef,
	isOpen,
	popupRef,
}: UsePopupPositionParameters): CSSProperties => {
	const [style, setStyle] = useState<CSSProperties>({});

	useLayoutEffect(() => {
		if (!isOpen || !anchorRef.current) {
			return;
		}

		const anchorRect = (inputRootRef?.current ?? anchorRef.current).getBoundingClientRect();
		const popupRect = popupRef.current?.getBoundingClientRect();
		const popupHeight = popupRect?.height ?? 0;
		const popupWidth = popupRect?.width ?? anchorRect.width;
		const spaceBelow = window.innerHeight - anchorRect.bottom;
		const showAbove = flip && popupHeight > spaceBelow && anchorRect.top > spaceBelow;
		const top = showAbove ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
		const left = Math.min(anchorRect.left, window.innerWidth - popupWidth - VIEWPORT_PADDING);

		setStyle({
			left: Math.max(VIEWPORT_PADDING, left),
			minWidth: anchorRect.width,
			top: Math.max(VIEWPORT_PADDING, top),
		});
	}, [anchorRef, flip, gap, inputRootRef, isOpen, popupRef]);

	return style;
};
