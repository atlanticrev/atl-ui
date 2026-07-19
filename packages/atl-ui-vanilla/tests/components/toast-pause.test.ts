import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { finishToastEnter, flushToastUpdates, getToastItem } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-pause-test';

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

const createOpenToast = async (): Promise<{ item: HTMLElement; region: AltToastElementApi }> => {
	const region = document.createElement(TAG_NAME) as AltToastElementApi;
	document.body.append(region);
	region.push({
		duration: 100,
		id: 'paused',
		message: 'Wait',
	});
	await flushToastUpdates();
	await finishToastEnter(region, 'paused');
	return {
		item: getToastItem(region, 'paused'),
		region,
	};
};

describe('alt-toast-region pause reasons', () => {
	it('does not resume while focus still pauses a toast after pointer leave', async () => {
		const { item, region } = await createOpenToast();
		const dismiss = item.querySelector<HTMLButtonElement>('.alt-toast__dismiss');
		item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		dismiss?.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
		item.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
		await vi.advanceTimersByTimeAsync(200);
		expect(item.dataset.state).toBe('open');

		dismiss?.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
		await vi.advanceTimersByTimeAsync(100);
		await flushToastUpdates();
		expect(getToastItem(region, 'paused').dataset.state).toBe('closing');
	});

	it('pauses all timers while the browser window is blurred', async () => {
		const { item } = await createOpenToast();
		window.dispatchEvent(new Event('blur'));
		await vi.advanceTimersByTimeAsync(200);
		expect(item.dataset.state).toBe('open');

		window.dispatchEvent(new Event('focus'));
		await vi.advanceTimersByTimeAsync(100);
		await flushToastUpdates();
		expect(item.dataset.state).toBe('closing');
	});

	it('clears transient interaction pauses when the region reconnects', async () => {
		const { item, region } = await createOpenToast();
		item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		region.remove();
		document.body.append(region);
		await vi.advanceTimersByTimeAsync(100);
		await flushToastUpdates();

		expect(item.dataset.state).toBe('closing');
	});
});
