import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltPopupElementClass } from '../../src/components/popup';
import type { AltPopupElementApi } from '../../src/components/popup/types';

const TAG_NAME = 'alt-popup-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltPopupElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-popup', () => {
	it('positions against an anchor and closes on Escape', async () => {
		const container = document.createElement('div');

		const anchor = document.createElement('button');

		const popup = document.createElement(TAG_NAME) as AltPopupElementApi;

		const onOpenChange = vi.fn();

		anchor.getBoundingClientRect = () => new DOMRect(20, 30, 100, 40);

		popup.getBoundingClientRect = () => new DOMRect(0, 0, 80, 60);

		popup.anchor = anchor;

		popup.addEventListener('alt-open-change', onOpenChange);

		container.append(anchor, popup);

		document.body.append(container);

		popup.show();

		await Promise.resolve();

		expect(popup.dataset.open).toBe('true');

		expect(popup.parentElement).toBe(document.body);

		expect(popup.style.left).toBe('20px');

		document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

		await Promise.resolve();

		expect(popup.open).toBe(false);

		expect(popup.parentElement).toBe(container);

		expect(onOpenChange).toHaveBeenCalledTimes(2);
	});
});
