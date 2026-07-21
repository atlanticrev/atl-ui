import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createAltTooltipElementClass } from '../../src/components/tooltip';
import type { AltTooltipElementApi } from '../../src/components/tooltip/types';

const TAG_NAME = 'alt-tooltip-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltTooltipElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-tooltip', () => {
	it('opens for pointer and exposes an accessible description', async () => {
		const tooltip = document.createElement(TAG_NAME) as AltTooltipElementApi;
		const trigger = document.createElement('button');
		trigger.textContent = 'Details';
		tooltip.setAttribute('title', 'More information');
		tooltip.append(trigger);
		document.body.append(tooltip);
		await Promise.resolve();
		tooltip.dispatchEvent(new Event('pointerenter'));
		await Promise.resolve();
		const panel = tooltip.querySelector<HTMLElement>('[role="tooltip"]');

		expect(panel?.hidden).toBe(false);
		expect(panel?.textContent).toBe('More information');
		expect(trigger.getAttribute('aria-describedby')).toBe(panel?.id);
		tooltip.dispatchEvent(new Event('pointerleave'));
		await Promise.resolve();
		expect(tooltip.open).toBe(false);
	});

	it('toggles in click mode', async () => {
		const tooltip = document.createElement(TAG_NAME) as AltTooltipElementApi;
		const trigger = document.createElement('button');
		tooltip.trigger = 'click';
		tooltip.append(trigger);
		document.body.append(tooltip);
		await Promise.resolve();
		trigger.click();
		expect(tooltip.open).toBe(true);
	});

	it('opens overflow-only tooltips only when their target is truncated', async () => {
		const tooltip = document.createElement(TAG_NAME) as AltTooltipElementApi;
		const trigger = document.createElement('span');
		trigger.dataset.altOverflowTarget = '';
		tooltip.setAttribute('show-on-overflow', '');
		tooltip.append(trigger);
		document.body.append(tooltip);
		await Promise.resolve();
		Object.defineProperty(trigger, 'clientWidth', { configurable: true, value: 100 });
		Object.defineProperty(trigger, 'scrollWidth', { configurable: true, value: 100 });
		tooltip.dispatchEvent(new Event('pointerenter'));
		expect(tooltip.open).toBe(false);
		Object.defineProperty(trigger, 'scrollWidth', { configurable: true, value: 180 });
		tooltip.dispatchEvent(new Event('pointerenter'));
		expect(tooltip.open).toBe(true);
	});
});
