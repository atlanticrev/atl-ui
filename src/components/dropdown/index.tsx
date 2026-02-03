'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { clsx } from '@/lib/clsx';

import type { DropdownMode, DropdownPlacement, DropdownPosition } from './types';

type DropdownProps = {
	anchorRef: React.RefObject<HTMLElement | null>;
	children: React.ReactNode;
	isOpen: boolean;
	onClose: () => void;
	className?: string;
	offset?: number;
	placement?: DropdownPlacement;
	mode?: DropdownMode;
	mobileBreakpoint?: number;
};

const DEFAULT_OFFSET = 8;
const DEFAULT_PLACEMENT: DropdownPlacement = 'bottom-start';
const DEFAULT_MODE: DropdownMode = 'anchored';
const DEFAULT_BREAKPOINT = 960;

const getTransformOrigin = (placement: DropdownPlacement) => {
	switch (placement) {
		case 'bottom-end':
			return 'top right';
		case 'top-start':
			return 'bottom left';
		case 'top-end':
			return 'bottom right';
		default:
			return 'top left';
	}
};

export const AtlDropdown = ({
	anchorRef,
	children,
	isOpen,
	onClose,
	className,
	offset = DEFAULT_OFFSET,
	placement = DEFAULT_PLACEMENT,
	mode = DEFAULT_MODE,
	mobileBreakpoint = DEFAULT_BREAKPOINT,
}: DropdownProps) => {
	const [position, setPosition] = useState<DropdownPosition | null>(null);
	const [isModal, setIsModal] = useState(false);

	const dropdownRef = useRef<HTMLDivElement | null>(null);
	const placementRef = useRef<DropdownPlacement>(placement);
	const observerRef = useRef<IntersectionObserver | null>(null);
	const resizeObserverRef = useRef<ResizeObserver | null>(null);
	const hasMeasuredRef = useRef(false);

	const resolveIsModal = useCallback(() => {
		if (mode === 'modal') {
			return true;
		}

		if (mode === 'anchored') {
			return false;
		}

		if (typeof window === 'undefined') {
			return false;
		}

		return window.matchMedia(`(max-width: ${mobileBreakpoint}px)`).matches;
	}, [mobileBreakpoint, mode]);

	const updatePosition = useCallback(
		(allowFlip: boolean) => {
			if (!anchorRef.current) {
				return;
			}

			const rect = anchorRef.current.getBoundingClientRect();
			const dropdownRect = dropdownRef.current?.getBoundingClientRect();
			const dropdownNode = dropdownRef.current;
			const dropdownWidth =
				dropdownRect?.width || dropdownNode?.offsetWidth || dropdownNode?.scrollWidth || rect.width;
			const dropdownHeight =
				dropdownRect?.height || dropdownNode?.offsetHeight || dropdownNode?.scrollHeight || 0;
			const viewportHeight = window.innerHeight;
			const viewportWidth = window.innerWidth;
			const scrollX = window.scrollX;
			const scrollY = window.scrollY;
			const spaceAbove = rect.top;
			const spaceBelow = viewportHeight - rect.bottom;
			const spaceLeft = rect.left;
			const spaceRight = viewportWidth - rect.right;
			const computedOffset = offset;
			const minWidth = rect.width;
			let computedPlacement: DropdownPlacement = allowFlip ? placement : placementRef.current;

			if (
				allowFlip &&
				placement.startsWith('bottom') &&
				dropdownHeight &&
				spaceBelow < dropdownHeight + computedOffset
			) {
				computedPlacement = computedPlacement.replace('bottom', 'top') as DropdownPlacement;
			}

			if (
				allowFlip &&
				placement.startsWith('top') &&
				dropdownHeight &&
				spaceAbove < dropdownHeight + computedOffset
			) {
				computedPlacement = computedPlacement.replace('top', 'bottom') as DropdownPlacement;
			}

			const wouldOverflowRight = rect.left + dropdownWidth > viewportWidth;
			const wouldOverflowLeft = rect.right - dropdownWidth < 0;

			if (
				allowFlip &&
				computedPlacement.endsWith('start') &&
				dropdownWidth &&
				wouldOverflowRight &&
				spaceLeft > spaceRight
			) {
				computedPlacement = computedPlacement.replace('start', 'end') as DropdownPlacement;
			}

			if (
				allowFlip &&
				computedPlacement.endsWith('end') &&
				dropdownWidth &&
				wouldOverflowLeft &&
				spaceRight > spaceLeft
			) {
				computedPlacement = computedPlacement.replace('end', 'start') as DropdownPlacement;
			}

			const isBottomPlacement = computedPlacement.startsWith('bottom');
			const isEndPlacement = computedPlacement.endsWith('end');

			let top = isBottomPlacement ? rect.bottom + scrollY + computedOffset : rect.top + scrollY - computedOffset;
			let left = isEndPlacement ? rect.right + scrollX : rect.left + scrollX;

			if (allowFlip && dropdownHeight) {
				const dropdownTop = isBottomPlacement ? top : top - dropdownHeight;
				const overflowTop = Math.max(0, scrollY + 8 - dropdownTop);
				const overflowBottom = Math.max(0, dropdownTop + dropdownHeight - (scrollY + viewportHeight - 8));
				top += overflowTop;
				top -= overflowBottom;
			}

			if (allowFlip && dropdownWidth) {
				const dropdownLeft = isEndPlacement ? left - dropdownWidth : left;
				const overflowLeft = Math.max(0, scrollX + 8 - dropdownLeft);
				const overflowRight = Math.max(0, dropdownLeft + dropdownWidth - (scrollX + viewportWidth - 8));
				left += overflowLeft;
				left -= overflowRight;
			}

			setPosition({
				top,
				left,
				minWidth,
				transformOrigin: getTransformOrigin(computedPlacement),
				placement: computedPlacement,
			});

			if (allowFlip) {
				placementRef.current = computedPlacement;
			}
		},
		[anchorRef, offset, placement],
	);

	const handlePointerDown = useCallback(
		(event: PointerEvent) => {
			if (!dropdownRef.current || !anchorRef.current) {
				return;
			}

			const targetNode = event.target as Node;
			const clickInsideDropdown = dropdownRef.current.contains(targetNode);
			const clickInsideAnchor = anchorRef.current.contains(targetNode);

			if (!clickInsideDropdown && !clickInsideAnchor) {
				onClose();
			}
		},
		[anchorRef, onClose],
	);

	const handleEscapeKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
			}
		},
		[onClose],
	);

	useLayoutEffect(() => {
		if (!isOpen) {
			hasMeasuredRef.current = false;
			return;
		}

		placementRef.current = placement;
		if (isModal) {
			return;
		}
		updatePosition(true);
	}, [isOpen, placement, updatePosition, isModal]);

	useLayoutEffect(() => {
		if (!isOpen || isModal || hasMeasuredRef.current) {
			return;
		}

		if (!dropdownRef.current) {
			return;
		}

		updatePosition(true);
		hasMeasuredRef.current = true;
	}, [isOpen, isModal, updatePosition]);

	useEffect(() => {
		const nextIsModal = resolveIsModal();
		setIsModal(nextIsModal);

		if (mode !== 'auto') {
			return;
		}

		if (typeof window === 'undefined') {
			return;
		}

		const mediaQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
		const handleChange = (event: MediaQueryListEvent) => {
			setIsModal(event.matches);
		};

		if (mediaQuery.addEventListener) {
			mediaQuery.addEventListener('change', handleChange);
		} else {
			mediaQuery.addListener(handleChange);
		}

		return () => {
			if (mediaQuery.removeEventListener) {
				mediaQuery.removeEventListener('change', handleChange);
			} else {
				mediaQuery.removeListener(handleChange);
			}
		};
	}, [mobileBreakpoint, mode, resolveIsModal]);

	useEffect(() => {
		if (!isOpen || !dropdownRef.current || isModal) {
			return;
		}

		if (resizeObserverRef.current) {
			resizeObserverRef.current.disconnect();
		}

		resizeObserverRef.current = new ResizeObserver(() => {
			updatePosition(true);
		});

		resizeObserverRef.current.observe(dropdownRef.current);

		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		observerRef.current = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) {
					return;
				}

				if (entry.intersectionRatio < 1) {
					updatePosition(true);
				}
			},
			{ threshold: [1] },
		);

		observerRef.current.observe(dropdownRef.current);

		return () => {
			observerRef.current?.disconnect();
			observerRef.current = null;
			resizeObserverRef.current?.disconnect();
			resizeObserverRef.current = null;
		};
	}, [isOpen, isModal, updatePosition]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		window.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('keydown', handleEscapeKey);

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isOpen, handleEscapeKey, handlePointerDown]);

	useEffect(() => {
		if (!isOpen || isModal) {
			return;
		}

		const handleResize = () => updatePosition(true);
		const handleScroll = () => updatePosition(true);

		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll, true);

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [isOpen, isModal, updatePosition]);

	const wrapperStyle = useMemo<CSSProperties | undefined>(() => {
		if (isModal) {
			return undefined;
		}

		if (!position) {
			return {
				top: 0,
				left: 0,
				minWidth: 0,
				visibility: 'hidden',
				['--dropdown-translate-x' as string]: '0',
				['--dropdown-translate-y' as string]: '0',
			};
		}

		const translateX = position.placement.endsWith('end') ? '-100%' : '0';
		const translateY = position.placement.startsWith('top') ? '-100%' : '0';

		return {
			top: position.top,
			left: position.left,
			minWidth: position.minWidth,
			transformOrigin: position.transformOrigin,
			['--dropdown-translate-x' as string]: translateX,
			['--dropdown-translate-y' as string]: translateY,
		};
	}, [position, isModal]);

	if (!isOpen) {
		return null;
	}

	const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	const content = isModal ? (
		// biome-ignore lint/a11y/noStaticElementInteractions: <overlay>
		<div
			className="atl-dropdown atl-dropdown__overlay"
			onClick={handleOverlayClick}
			role="presentation"
		>
			<div
				className={clsx('atl-dropdown__panel', className)}
				ref={dropdownRef}
			>
				{children}
			</div>
		</div>
	) : (
		<div
			className={clsx('atl-dropdown', className)}
			ref={dropdownRef}
			style={wrapperStyle}
		>
			{children}
		</div>
	);

	return createPortal(content, document.body);
};
