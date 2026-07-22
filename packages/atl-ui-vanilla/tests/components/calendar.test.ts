import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	addMonths,
	createAltCalendarElementClass,
	formatDateValue,
	parseDateValue,
} from '../../src/components/calendar';
import type { AltCalendarElementApi } from '../../src/components/calendar/types';

const TAG_NAME = 'alt-calendar-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME))
		customElements.define(TAG_NAME, createAltCalendarElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

const render = async (attributes = ''): Promise<AltCalendarElementApi> => {
	document.body.innerHTML = `<${TAG_NAME} ${attributes}></${TAG_NAME}>`;

	await Promise.resolve();

	return document.querySelector(TAG_NAME) as AltCalendarElementApi;
};

describe('alt-calendar', () => {
	it('preserves and clamps the day when changing months', () => {
		expect(formatDateValue(addMonths(parseDateValue('2026-07-26') as Date, 1))).toBe('2026-08-26');

		expect(formatDateValue(addMonths(parseDateValue('2026-01-31') as Date, 1))).toBe('2026-02-28');
	});

	it('renders a complete localized day grid and respects bounds', async () => {
		const calendar = await render(
			'locale="en-GB" first-day="1" min="2026-07-06" max="2026-07-31" value="2026-07-22"',
		);

		const previous = calendar.querySelector<HTMLButtonElement>('[data-action="previous"]');

		const next = calendar.querySelector<HTMLButtonElement>('[data-action="next"]');

		expect(previous?.querySelector('[data-alt-icon="chevron-left"]')).toBeInstanceOf(SVGSVGElement);

		expect(next?.querySelector('[data-alt-icon="chevron-right"]')).toBeInstanceOf(SVGSVGElement);

		expect(previous?.classList.contains('alt-button')).toBe(true);

		expect(next?.classList.contains('alt-button')).toBe(true);

		expect(previous?.textContent).toBe('');

		expect(next?.textContent).toBe('');

		expect(calendar.querySelectorAll('[data-value]').length).toBe(42);

		expect(calendar.querySelector('.alt-calendar__weekdays')?.textContent).toContain('Mon');

		expect(calendar.querySelector<HTMLButtonElement>('[data-value="2026-07-05"]')?.disabled).toBe(true);

		expect(calendar.querySelector('[data-value="2026-07-22"]')?.getAttribute('aria-pressed')).toBe('true');

		expect(calendar.querySelector('[data-action="reset"]')?.getAttribute('data-variant')).toBe('text');

		expect(calendar.querySelector('[data-action="apply"]')?.getAttribute('data-variant')).toBe('filled');
	});

	it('selects an ordered range and waits for Apply in explicit mode', async () => {
		const calendar = await render('selection-mode="range" commit-mode="explicit" start="2026-07-18"');

		const changed = vi.fn();

		calendar.addEventListener('alt-change', changed);

		calendar.querySelector<HTMLButtonElement>('[data-value="2026-07-08"]')?.click();

		await Promise.resolve();

		expect(calendar.getAttribute('start')).toBe('2026-07-08');

		expect(calendar.getAttribute('end')).toBe('2026-07-18');

		expect(changed).not.toHaveBeenCalled();

		calendar.querySelector<HTMLButtonElement>('[data-action="apply"]')?.click();

		expect(changed).toHaveBeenCalledOnce();
	});

	it('moves keyboard focus across days and month boundaries', async () => {
		const calendar = await render('value="2026-07-31"');

		const day = calendar.querySelector<HTMLButtonElement>('[data-value="2026-07-31"]');

		day?.focus();

		day?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }));

		await Promise.resolve();

		expect(document.activeElement).toBe(calendar.querySelector('[data-value="2026-08-01"]'));
	});

	it('drills from years to months to days', async () => {
		const calendar = await render('view="years" value="2026-07-22"');

		calendar.querySelector<HTMLButtonElement>('[data-value="2026"]')?.click();

		await Promise.resolve();

		expect(calendar.querySelector('.alt-calendar__grid')?.getAttribute('data-view')).toBe('months');

		calendar.querySelector<HTMLButtonElement>('[data-value="2026-07"]')?.click();

		await Promise.resolve();

		expect(calendar.querySelector('.alt-calendar__grid')?.getAttribute('data-view')).toBe('days');
	});

	it('opens a bounded year view at the nearest available year', async () => {
		const calendar = await render('view="years" min="1900-01-01" max="2008-07-22"');

		expect(calendar.querySelector<HTMLButtonElement>('[data-value="2008"]')?.disabled).toBe(false);

		expect(calendar.querySelector('[data-value="2026"]')).toBeNull();
	});

	it('supports consumer presets and disabled-date callbacks', async () => {
		const calendar = await render('selection-mode="range" value="2026-07-22"');

		calendar.presets = [{ end: '2026-07-22', label: 'This week', start: '2026-07-20' }];

		calendar.disabledDate = (value) => value === '2026-07-23';

		await Promise.resolve();

		const preset = calendar.querySelector<HTMLButtonElement>('[data-preset="0"]');

		expect(preset).toBeInstanceOf(HTMLButtonElement);

		expect(preset?.classList.contains('alt-chip')).toBe(true);

		expect(preset?.querySelector('.alt-chip__label')?.textContent).toBe('This week');

		expect(preset?.classList.contains('alt-calendar__preset')).toBe(false);

		expect(calendar.querySelector<HTMLButtonElement>('[data-value="2026-07-23"]')?.disabled).toBe(true);

		preset?.click();

		expect(calendar.getAttribute('start')).toBe('2026-07-20');

		expect(calendar.getAttribute('end')).toBe('2026-07-22');
	});
});
