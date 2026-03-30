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

type PopupStyleParams = {
	anchorRect: DOMRect;
	flip: boolean;
	gap: number;
	popupRect: DOMRect;
};

const createPopupStyle = ({
	anchorRect,
	flip,
	gap,
	popupRect,
}: PopupStyleParams): CSSProperties => {
	const popupHeight = popupRect.height || 0;
	const popupWidth = popupRect.width || anchorRect.width;
	const spaceBelow = window.innerHeight - anchorRect.bottom;
	const showAbove = flip && popupHeight > spaceBelow && anchorRect.top > spaceBelow;
	const top = showAbove ? anchorRect.top - popupHeight - gap : anchorRect.bottom + gap;
	const left = Math.min(anchorRect.left, window.innerWidth - popupWidth - VIEWPORT_PADDING);

	return {
		left: Math.max(VIEWPORT_PADDING, left),
		minWidth: anchorRect.width,
		top: Math.max(VIEWPORT_PADDING, top),
	};
};

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
		const anchorElement = inputRootRef?.current ?? anchorRef.current;
		const popupElement = popupRef.current;

		if (!isOpen || !anchorElement || !popupElement) {
			return;
		}

		const updatePosition = () => {
			setStyle(
				createPopupStyle({
					anchorRect: anchorElement.getBoundingClientRect(),
					flip,
					gap,
					popupRect: popupElement.getBoundingClientRect(),
				}),
			);
		};

		updatePosition();

		window.addEventListener('resize', updatePosition);
		window.addEventListener('scroll', updatePosition, true);

		const resizeObserver = typeof ResizeObserver === 'undefined'
			? undefined
			: new ResizeObserver(updatePosition);

		resizeObserver?.observe(anchorElement);
		resizeObserver?.observe(popupElement);

		return () => {
			window.removeEventListener('resize', updatePosition);
			window.removeEventListener('scroll', updatePosition, true);
			resizeObserver?.disconnect();
		};
	}, [anchorRef, flip, gap, inputRootRef, isOpen, popupRef]);

	return style;
};
