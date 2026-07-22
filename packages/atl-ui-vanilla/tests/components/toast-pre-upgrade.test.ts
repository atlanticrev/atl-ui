import { describe, expect, it } from 'vitest';

import { createAltToastRegionElementClass } from '../../src/components/toast';
import type { AltToastElementApi } from '../../src/components/toast/types';

describe('alt-toast-region upgrade', () => {
	it('preserves public properties assigned before definition', async () => {
		const tagName = 'alt-toast-region-pre-upgrade-test';

		const region = document.createElement(tagName) as AltToastElementApi;

		region.max = 1;

		region.defaultDuration = 0;

		region.preventDuplicate = true;

		document.body.append(region);

		customElements.define(tagName, createAltToastRegionElementClass(window.HTMLElement));

		await Promise.resolve();

		expect(region.max).toBe(1);

		expect(region.defaultDuration).toBe(0);

		expect(region.preventDuplicate).toBe(true);

		region.push('One');

		region.push('Two');

		await Promise.resolve();

		expect(region.querySelectorAll('.alt-toast')).toHaveLength(1);
	});
});
