import { describe, expect, it } from 'vitest';

import {
	getClosingDistance,
	getSwipeProgress,
	getSwipeSnapDuration,
	isSwipeDismissGesture,
	shouldDismissSwipe,
} from '../../src/controllers/swipe-dismiss-gesture';

describe('swipe dismiss gesture', () => {
	it('maps every placement to its closing direction', () => {
		expect(getClosingDistance('left', -24, 0)).toBe(24);

		expect(getClosingDistance('right', 24, 0)).toBe(24);

		expect(getClosingDistance('top', 0, -24)).toBe(24);

		expect(getClosingDistance('bottom', 0, 24)).toBe(24);
	});

	it('activates only after a deliberate dominant-axis gesture', () => {
		expect(isSwipeDismissGesture('left', -24, 8)).toBe(true);

		expect(isSwipeDismissGesture('left', -8, 2)).toBe(false);

		expect(isSwipeDismissGesture('bottom', 8, 24)).toBe(true);

		expect(isSwipeDismissGesture('bottom', 28, 20)).toBe(false);
	});

	it('uses position unless a fling clearly communicates intent', () => {
		expect(shouldDismissSwipe('left', { progress: 0.4, velocityX: 0, velocityY: 0 })).toBe(true);

		expect(shouldDismissSwipe('left', { progress: 0.7, velocityX: -900, velocityY: 100 })).toBe(true);

		expect(shouldDismissSwipe('bottom', { progress: 0.3, velocityX: 100, velocityY: -900 })).toBe(false);
	});

	it('bounds progress and shortens fling snaps by remaining distance', () => {
		expect(getSwipeProgress(80, 320)).toBe(0.75);

		expect(getSwipeProgress(400, 320)).toBe(0);

		expect(getSwipeSnapDuration(0.25, true, true)).toBe(50);

		expect(getSwipeSnapDuration(0.75, true, true)).toBe(150);

		expect(getSwipeSnapDuration(0.75, true, false)).toBe(250);
	});
});
