import { afterEach, describe, expect, it, vi } from 'vitest';

import type { RectLike } from '../../src/controllers/position';
import { bindOverlayPosition } from '../../src/controllers/position-observer';

const rect = (x: number, y: number, width: number, height: number): RectLike => ({
	bottom: y + height,
	height,
	left: x,
	right: x + width,
	top: y,
	width,
});

describe('bindOverlayPosition', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('updates on layout signals and cleans up through AbortSignal', () => {
		const anchor = document.createElement('button');

		const overlay = document.createElement('div');

		document.body.append(anchor, overlay);

		vi.spyOn(anchor, 'getBoundingClientRect').mockReturnValue(rect(10, 20, 100, 20) as DOMRect);

		vi.spyOn(overlay, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 80, 50) as DOMRect);

		const observerState: {
			callback?: ResizeObserverCallback;
		} = {};

		const disconnect = vi.fn();

		const observe = vi.fn();

		class ResizeObserverMock {
			constructor(callback: ResizeObserverCallback) {
				observerState.callback = callback;
			}

			disconnect = disconnect;
			observe = observe;
			unobserve = vi.fn();
		}

		const onPosition = vi.fn();

		const controller = new AbortController();

		bindOverlayPosition({
			anchor,
			onPosition,
			overlay,
			resizeObserver: ResizeObserverMock,
			signal: controller.signal,
		});

		expect(onPosition).toHaveBeenCalledTimes(1);

		expect(observe).toHaveBeenCalledTimes(2);

		document.dispatchEvent(new Event('scroll'));

		window.dispatchEvent(new Event('resize'));

		observerState.callback?.([], {} as ResizeObserver);

		expect(onPosition).toHaveBeenCalledTimes(4);

		controller.abort();

		document.dispatchEvent(new Event('scroll'));

		window.dispatchEvent(new Event('resize'));

		expect(onPosition).toHaveBeenCalledTimes(4);

		expect(disconnect).toHaveBeenCalledOnce();
	});
});
