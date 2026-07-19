import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { flushToastUpdates, getToastItem } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-transition-fallback-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('alt-toast-region transition fallback', () => {
	it('finishes every phase if animation events are unavailable', async () => {
		const region = document.createElement(TAG_NAME) as AltToastElementApi;
		document.body.append(region);
		region.push({
			duration: 0,
			id: 'fallback',
			message: 'No animation events',
		});
		await flushToastUpdates();
		expect(getToastItem(region, 'fallback').dataset.state).toBe('entering');

		await vi.advanceTimersByTimeAsync(500);
		await flushToastUpdates();
		expect(getToastItem(region, 'fallback').dataset.state).toBe('open');
		region.dismiss('fallback');
		await flushToastUpdates();
		await vi.advanceTimersByTimeAsync(450);
		await flushToastUpdates();
		expect(getToastItem(region, 'fallback').dataset.state).toBe('collapsing');
		await vi.advanceTimersByTimeAsync(450);
		await flushToastUpdates();
		expect(region.querySelector('.alt-toast')).toBeNull();
	});
});
