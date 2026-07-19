import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

const TAG_NAME = 'alt-toast-region-test';

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();
};

const createRegion = (): AltToastElementApi => {
	return document.createElement(TAG_NAME) as AltToastElementApi;
};

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-toast-region', () => {
	it('owns one keyed live-region stack and updates text safely', async () => {
		const region = createRegion();
		document.body.append(region);
		expect(region.defaultDuration).toBe(5_000);
		region.push({
			duration: 0,
			id: 'sync',
			message: '<strong>Saved</strong>',
			status: 'success',
		});
		await flushUpdates();
		const stack = region.querySelector('.alt-toast-region__stack');
		const item = region.querySelector<HTMLElement>('[data-toast-id="sync"]');
		expect(stack?.getAttribute('aria-live')).toBe('polite');
		expect(item?.dataset.status).toBe('success');
		expect(item?.textContent).toContain('<strong>Saved</strong>');
		expect(item?.querySelector('strong')).toBeNull();

		region.push({
			duration: 0,
			id: 'sync',
			message: 'Updated',
		});
		await flushUpdates();
		expect(region.querySelector('.alt-toast-region__stack')).toBe(stack);
		expect(region.querySelectorAll('.alt-toast')).toHaveLength(1);
		expect(region.querySelector('.alt-toast__message')?.textContent).toBe('Updated');
	});

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
		await flushUpdates();

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
		await flushUpdates();
		region.querySelector<HTMLButtonElement>('.alt-toast__dismiss')?.click();
		await flushUpdates();
		expect(region.querySelector('.alt-toast')).toBeNull();
		expect(onDismiss.mock.calls[0][0].detail.reason).toBe('close');

		region.push({
			duration: 0,
			message: 'One',
		});
		region.push({
			duration: 0,
			message: 'Two',
		});
		region.clear();
		await flushUpdates();
		expect(region.querySelector('.alt-toast')).toBeNull();
		expect(onDismiss.mock.calls.at(-1)?.[0].detail.reason).toBe('clear');
	});
});
