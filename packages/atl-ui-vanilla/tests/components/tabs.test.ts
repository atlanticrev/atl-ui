import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltTabsElementClass } from '../../src/components/tabs';
import type { AltTabsElementApi } from '../../src/components/tabs/types';

const TAG_NAME = 'alt-tabs-test';

const flushUpdates = async (): Promise<void> => {
	await Promise.resolve();
};

const createTabs = (): AltTabsElementApi => {
	const host = document.createElement(TAG_NAME) as AltTabsElementApi;

	host.innerHTML = `
		<div role="tablist">
			<button role="tab" data-key="first">First</button>
			<button role="tab" data-key="disabled" disabled>Disabled</button>
			<button role="tab" data-key="last">Last</button>
		</div>
		<section role="tabpanel" data-key="first">First panel</section>
		<section role="tabpanel" data-key="disabled">Disabled panel</section>
		<section role="tabpanel" data-key="last">Last panel</section>
	`;

	return host;
};

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltTabsElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-tabs', () => {
	it('keeps authored light DOM and links its accessible tab state', async () => {
		const host = createTabs();

		const firstPanel = host.querySelector<HTMLElement>('[data-key="first"][role="tabpanel"]');

		document.body.append(host);

		await flushUpdates();

		const firstTab = host.querySelector<HTMLElement>('[data-key="first"][role="tab"]');

		const lastPanel = host.querySelector<HTMLElement>('[data-key="last"][role="tabpanel"]');

		expect(host.activeKey).toBe('first');

		expect(firstTab?.getAttribute('aria-selected')).toBe('true');

		expect(firstTab?.getAttribute('aria-controls')).toBe(firstPanel?.id);

		expect(firstPanel?.getAttribute('aria-labelledby')).toBe(firstTab?.id);

		expect(firstPanel?.hidden).toBe(false);

		expect(lastPanel?.hidden).toBe(true);

		expect(host.contains(firstPanel)).toBe(true);
	});

	it('activates on click and emits one typed change after reconnect', async () => {
		const host = createTabs();

		const onChange = vi.fn();

		host.addEventListener('alt-change', onChange);

		document.body.append(host);

		await flushUpdates();

		host.remove();

		document.body.append(host);

		await flushUpdates();

		const lastTab = host.querySelector<HTMLButtonElement>('[data-key="last"][role="tab"]');

		lastTab?.click();

		await flushUpdates();

		expect(host.activeKey).toBe('last');

		expect(onChange).toHaveBeenCalledTimes(1);

		expect(onChange.mock.calls[0][0].detail).toEqual({
			activeKey: 'last',
			previousKey: 'first',
		});
	});

	it('wraps arrow navigation, supports Home and skips disabled tabs', async () => {
		const host = createTabs();

		document.body.append(host);

		await flushUpdates();

		const first = host.querySelector<HTMLButtonElement>('[data-key="first"][role="tab"]');

		const last = host.querySelector<HTMLButtonElement>('[data-key="last"][role="tab"]');

		first?.dispatchEvent(
			new KeyboardEvent('keydown', {
				bubbles: true,
				key: 'ArrowLeft',
			}),
		);

		await flushUpdates();

		expect(host.activeKey).toBe('last');

		expect(document.activeElement).toBe(last);

		last?.dispatchEvent(
			new KeyboardEvent('keydown', {
				bubbles: true,
				key: 'Home',
			}),
		);

		await flushUpdates();

		expect(host.activeKey).toBe('first');
	});
});
