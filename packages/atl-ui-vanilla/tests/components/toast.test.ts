import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { finishToastClose, finishToastEnter, flushToastUpdates, getToastItem } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-test';

const createRegion = (): AltToastElementApi => document.createElement(TAG_NAME) as AltToastElementApi;

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-toast-region', () => {
	it('keeps the newest three by default and reports overflow', async () => {
		const region = createRegion();

		const onDismiss = vi.fn();

		region.addEventListener('alt-dismiss', onDismiss);

		document.body.append(region);

		for (const id of ['one', 'two', 'three', 'four']) {
			region.push({
				duration: 0,
				id,
				message: id,
			});
		}

		await flushToastUpdates();

		expect(getToastItem(region, 'one').hasAttribute('data-close-pending')).toBe(true);

		await finishToastEnter(region, 'one');

		expect(getToastItem(region, 'one').dataset.state).toBe('closing');

		await finishToastClose(region, 'one');

		expect(
			Array.from(region.querySelectorAll<HTMLElement>('.alt-toast')).map((item) => item.dataset.toastId),
		).toEqual(['two', 'three', 'four']);

		expect(onDismiss.mock.calls[0][0].detail).toEqual({
			id: 'one',
			reason: 'overflow',
			status: 'info',
		});
	});

	it('dismisses with its native close button and can clear', async () => {
		const region = createRegion();

		const onDismiss = vi.fn();

		region.addEventListener('alt-dismiss', onDismiss);

		document.body.append(region);

		region.push({
			duration: 0,
			id: 'closable',
			message: 'Close me',
		});

		await flushToastUpdates();

		await finishToastEnter(region, 'closable');

		region.querySelector<HTMLButtonElement>('.alt-toast__dismiss')?.click();

		await flushToastUpdates();

		expect(region.querySelector('.alt-toast')).not.toBeNull();

		expect(onDismiss).not.toHaveBeenCalled();

		await finishToastClose(region, 'closable');

		expect(region.querySelector('.alt-toast')).toBeNull();

		expect(onDismiss.mock.calls[0][0].detail.reason).toBe('close');

		const firstId = region.push({
			duration: 0,
			message: 'One',
		});

		const secondId = region.push({
			duration: 0,
			message: 'Two',
		});

		await flushToastUpdates();

		await finishToastEnter(region, firstId);

		await finishToastEnter(region, secondId);

		region.clear();

		await flushToastUpdates();

		await finishToastClose(region, firstId);

		await finishToastClose(region, secondId);

		expect(region.querySelector('.alt-toast')).toBeNull();

		expect(onDismiss.mock.calls.at(-1)?.[0].detail.reason).toBe('clear');
	});
});
