import { afterEach, describe, expect, it, vi } from 'vitest';

import { animateSwipeSettle } from '../../src/controllers/swipe-dismiss-animation';

afterEach(() => {
	vi.useRealTimers();

	vi.unstubAllGlobals();
});

describe('swipe dismiss animation', () => {
	it('applies the target before fallback completion when paint frames stall', async () => {
		vi.useFakeTimers();

		vi.stubGlobal(
			'requestAnimationFrame',
			vi.fn(() => 1),
		);

		const sequence: string[] = [];

		const surface = document.createElement('div');

		document.body.append(surface);

		animateSwipeSettle(surface, {
			duration: 250,
			durationProperty: '--test-motion-duration',
			onComplete: () => sequence.push('complete'),
			onTarget: () => sequence.push('target'),
			waitForPaint: true,
		});

		expect(sequence).toEqual([]);

		await vi.advanceTimersByTimeAsync(380);

		expect(sequence).toEqual(['target', 'complete']);
	});
});
