import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { finishToastClose, finishToastEnter, flushToastUpdates, getToastItem } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-lifecycle-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();

	vi.useFakeTimers();

	vi.setSystemTime(0);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('alt-toast-region lifecycle', () => {
	it('pauses its timeout on hover and resumes it afterwards', async () => {
		const region = document.createElement(TAG_NAME) as AltToastElementApi;

		document.body.append(region);

		region.push({
			duration: 100,
			id: 'paused',
			message: 'Wait',
		});

		await flushToastUpdates();

		await finishToastEnter(region, 'paused');

		const toast = region.querySelector<HTMLElement>('.alt-toast');

		toast?.dispatchEvent(
			new MouseEvent('mouseover', {
				bubbles: true,
			}),
		);

		vi.advanceTimersByTime(200);

		expect(region.querySelector('.alt-toast')).not.toBeNull();

		toast?.dispatchEvent(
			new MouseEvent('mouseout', {
				bubbles: true,
			}),
		);

		vi.advanceTimersByTime(100);

		await flushToastUpdates();

		expect(getToastItem(region, 'paused').dataset.state).toBe('closing');

		await finishToastClose(region, 'paused');

		expect(region.querySelector('.alt-toast')).toBeNull();
	});

	it('aborts timers while disconnected and resumes them on reconnect', async () => {
		const region = document.createElement(TAG_NAME) as AltToastElementApi;

		document.body.append(region);

		region.push({
			duration: 100,
			id: 'lifecycle',
			message: 'Wait',
		});

		await flushToastUpdates();

		await finishToastEnter(region, 'lifecycle');

		vi.advanceTimersByTime(40);

		region.remove();

		vi.advanceTimersByTime(100);

		expect(region.dismiss('lifecycle')).toBe(true);

		region.push({
			duration: 100,
			id: 'reconnect',
			message: 'Back',
		});

		document.body.append(region);

		await flushToastUpdates();

		await finishToastEnter(region, 'reconnect');

		vi.advanceTimersByTime(100);

		await flushToastUpdates();

		expect(region.dismiss('reconnect')).toBe(false);
	});
});
