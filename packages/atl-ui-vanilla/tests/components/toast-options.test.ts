import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

import { finishToastEnter, flushToastUpdates } from './toast-test-utils';

const TAG_NAME = 'alt-toast-region-options-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltToastRegionElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-toast-region options', () => {
	it('prevents duplicate messages globally or per toast', async () => {
		const region = document.createElement(TAG_NAME) as AltToastElementApi;

		region.preventDuplicate = true;

		document.body.append(region);

		const firstId = region.push('Already saved');

		const duplicateId = region.push('Already saved');

		region.push({
			message: 'Already saved',
			preventDuplicate: false,
		});

		await flushToastUpdates();

		expect(duplicateId).toBe(firstId);

		expect(region.querySelectorAll('.alt-toast')).toHaveLength(2);
	});

	it('keeps persistent notifications open until explicitly dismissed', async () => {
		vi.useFakeTimers();

		const region = document.createElement(TAG_NAME) as AltToastElementApi;

		document.body.append(region);

		const id = region.push({
			duration: 10,
			message: 'Uploading',
			persist: true,
		});

		await flushToastUpdates();

		await finishToastEnter(region, id);

		await vi.advanceTimersByTimeAsync(10_000);

		expect(region.querySelector(`[data-toast-id="${id}"]`)).not.toBeNull();

		vi.useRealTimers();
	});
});
