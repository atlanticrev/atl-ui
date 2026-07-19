import { describe, expect, it } from 'vitest';

import { createAltTabsElementClass } from '../../src/components/tabs';
import type { AltTabsElementApi } from '../../src/components/tabs/types';

describe('alt-tabs upgrade', () => {
	it('preserves an activeKey property assigned before definition', async () => {
		const tagName = 'alt-tabs-pre-upgrade-test';
		const host = document.createElement(tagName) as AltTabsElementApi;
		host.activeKey = 'last';
		host.innerHTML = `
			<div role="tablist">
				<button role="tab" data-key="first">First</button>
				<button role="tab" data-key="last">Last</button>
			</div>
			<section role="tabpanel" data-key="first">First panel</section>
			<section role="tabpanel" data-key="last">Last panel</section>
		`;
		document.body.append(host);
		customElements.define(tagName, createAltTabsElementClass(window.HTMLElement));
		await Promise.resolve();

		expect(host.activeKey).toBe('last');
		expect(host.querySelector('[data-key="last"]')?.getAttribute('aria-selected')).toBe('true');
	});
});
