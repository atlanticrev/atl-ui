import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePopupPosition } from './use-popup-position';

type RectParams = {
	height?: number;
	width?: number;
	x?: number;
	y?: number;
};

const createRect = ({ height = 0, width = 0, x = 0, y = 0 }: RectParams = {}): DOMRect =>
	({
		bottom: y + height,
		height,
		left: x,
		right: x + width,
		top: y,
		width,
		x,
		y,
	}) as DOMRect;

describe('usePopupPosition', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('recalculates popup coordinates on scroll', async () => {
		let anchorRect = createRect({
			height: 40,
			width: 120,
			x: 20,
			y: 100,
		});
		const anchorElement = document.createElement('div');
		const popupElement = document.createElement('div');
		const anchorRef = {
			current: anchorElement,
		};
		const popupRef = {
			current: popupElement,
		};

		vi.spyOn(anchorElement, 'getBoundingClientRect').mockImplementation(() => anchorRect);

		vi.spyOn(popupElement, 'getBoundingClientRect').mockImplementation(() => createRect({
			height: 80,
			width: 150,
		}));

		const { result } = renderHook(() => usePopupPosition({
			anchorRef,
			flip: false,
			gap: 4,
			isOpen: true,
			popupRef,
		}));

		await waitFor(() => {
			expect(result.current.left).toBe(20);
			expect(result.current.minWidth).toBe(120);
			expect(result.current.top).toBe(144);
		});

		anchorRect = createRect({
			height: 40,
			width: 120,
			x: 20,
			y: 60,
		});

		act(() => {
			window.dispatchEvent(new Event('scroll'));
		});

		await waitFor(() => {
			expect(result.current.left).toBe(20);
			expect(result.current.top).toBe(104);
		});
	});
});
