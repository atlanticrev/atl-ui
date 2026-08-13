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

		tooltip.text = 'More information';

		tooltip.append(trigger);

		document.body.append(tooltip);

		await Promise.resolve();

		const panel = tooltip.querySelector<HTMLElement>('[role="tooltip"]') as HTMLElement;

		tooltip.dispatchEvent(new Event('pointerenter'));

		await Promise.resolve();

		expect(panel.parentElement).toBe(document.body);

		expect(panel.hidden).toBe(false);

		expect(panel.textContent).toBe('More information');

		expect(tooltip.hasAttribute('title')).toBe(false);

		expect(trigger.getAttribute('aria-describedby')).toBe(panel.id);

		tooltip.dispatchEvent(new Event('pointerleave'));

		await Promise.resolve();

		expect(tooltip.open).toBe(false);

		expect(panel.parentElement).toBe(tooltip);
	});

	it('migrates the legacy title attribute without leaving a native tooltip behind', async () => {
		const tooltip = document.createElement(TAG_NAME) as AltTooltipElementApi;

		tooltip.setAttribute('title', 'Legacy information');

		tooltip.append(document.createElement('button'));

		document.body.append(tooltip);

		await Promise.resolve();

		expect(tooltip.text).toBe('Legacy information');

		expect(tooltip.title).toBe('Legacy information');

		expect(tooltip.getAttribute('text')).toBe('Legacy information');

		expect(tooltip.hasAttribute('title')).toBe(false);
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
