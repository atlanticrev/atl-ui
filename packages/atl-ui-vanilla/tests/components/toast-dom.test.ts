import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { flushToastUpdates } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-dom-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-toast-region DOM', () => {
	it('keeps keyed markup accessible and updates text safely', async () => {
		const region = document.createElement(TAG_NAME) as AltToastElementApi;
		document.body.append(region);
		expect(region.defaultDuration).toBe(5_000);
		region.push({
			duration: 0,
			id: 'sync',
			message: '<strong>Saved</strong>',
			status: 'success',
		});
		await flushToastUpdates();
		const stack = region.querySelector('.alt-toast-region__stack');
		const item = region.querySelector<HTMLElement>('.alt-toast[data-toast-id="sync"]');
		const dismiss = item?.querySelector<HTMLButtonElement>('.alt-toast__dismiss');
		expect(stack?.getAttribute('aria-live')).toBeNull();
		expect(item?.dataset.status).toBe('success');
		expect(item?.getAttribute('aria-atomic')).toBe('true');
		expect(item?.getAttribute('role')).toBe('status');
		expect(item?.textContent).toContain('<strong>Saved</strong>');
		expect(item?.querySelector('strong')).toBeNull();
		expect(dismiss?.textContent).toBe('');
		expect(dismiss?.getAttribute('aria-label')).toBe('Dismiss notification');

		region.push({
			duration: 0,
			id: 'sync',
			message: 'Updated',
		});
		await flushToastUpdates();
		expect(region.querySelector('.alt-toast-region__stack')).toBe(stack);
		expect(region.querySelectorAll('.alt-toast')).toHaveLength(1);
		expect(region.querySelector('.alt-toast__message')?.textContent).toBe('Updated');
	});
});
