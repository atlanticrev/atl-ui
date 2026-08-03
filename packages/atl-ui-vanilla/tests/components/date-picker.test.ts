import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { defineAltCalendar } from '../../src/components/calendar';
import { defineAltDatePicker, defineAltDateRangePicker } from '../../src/components/date-picker';
import type { AltDateRangePickerElementApi } from '../../src/components/date-picker/types';

beforeAll(() => {
	defineAltCalendar();

	defineAltDatePicker();

	defineAltDateRangePicker();
});

beforeEach(() => document.body.replaceChildren());

describe('date pickers', () => {
	it('commits a single date and submits through a native form carrier', async () => {
		document.body.innerHTML =
			'<form><alt-date-picker name="publishDate" value="2000-01-22"></alt-date-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-picker') as HTMLElement;

		const change = vi.fn();

		const panel = picker.querySelector<HTMLElement>('.alt-date-picker__panel') as HTMLElement;

		const clear = picker.querySelector<HTMLButtonElement>('.alt-date-picker__clear');

		expect(clear?.querySelector('[data-alt-icon="close"]')).toBeInstanceOf(SVGSVGElement);

		expect(clear?.classList.contains('alt-button')).toBe(true);

		expect(clear?.textContent).toBe('');

		picker.addEventListener('alt-change', change);

		picker.querySelector<HTMLButtonElement>('.alt-date-picker__trigger')?.click();

		await Promise.resolve();

		const nextDay = panel.querySelector<HTMLButtonElement>('[data-value="2000-01-23"]');

		if (!nextDay) throw new Error('Initial date-picker value did not select the visible month.');

		nextDay.click();

		await Promise.resolve();

		expect(picker.getAttribute('value')).toBe('2000-01-23');

		expect(change).toHaveBeenCalledOnce();

		expect(new FormData(document.querySelector('form') as HTMLFormElement).get('publishDate')).toBe('2000-01-23');

		expect(picker.hasAttribute('open')).toBe(false);
	});

	it('submits both range values only after a complete selection', async () => {
		document.body.innerHTML =
			'<form><alt-date-range-picker name="from" name-end="to" start="2000-01-10"></alt-date-range-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-range-picker') as AltDateRangePickerElementApi;

		const changed = vi.fn();

		const panel = picker.querySelector<HTMLElement>('.alt-date-picker__panel') as HTMLElement;

		picker.addEventListener('alt-change', changed);

		picker.open = true;

		await Promise.resolve();

		const rangeEnd = panel.querySelector<HTMLButtonElement>('[data-value="2000-01-14"]');

		if (!rangeEnd) throw new Error('Initial date range did not select the visible month.');

		rangeEnd.click();

		await Promise.resolve();

		expect(changed).not.toHaveBeenCalled();

		panel.querySelector<HTMLButtonElement>('[data-action="apply"]')?.click();

		await Promise.resolve();

		const data = new FormData(document.querySelector('form') as HTMLFormElement);

		expect(data.get('from')).toBe('2000-01-10');

		expect(data.get('to')).toBe('2000-01-14');

		expect(changed).toHaveBeenCalledOnce();
	});

	it('restores authored defaults on native form reset', async () => {
		document.body.innerHTML = '<form><alt-date-picker name="date" value="2000-01-22"></alt-date-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-picker') as HTMLElement & { value: string | null };

		picker.value = '2000-01-23';

		(document.querySelector('form') as HTMLFormElement).reset();

		await Promise.resolve();

		expect(picker.value).toBe('2000-01-22');
	});

	it('portals the panel as a fallback and restores it on close or disconnect', async () => {
		document.body.innerHTML = '<alt-date-range-picker start="2000-01-10"></alt-date-range-picker>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-range-picker') as AltDateRangePickerElementApi;

		const panel = picker.querySelector<HTMLDivElement>('.alt-date-picker__panel') as HTMLDivElement & {
			togglePopover?: (force?: boolean) => boolean;
		};

		Object.defineProperty(panel, 'togglePopover', { configurable: true, value: undefined });

		picker.open = true;

		await Promise.resolve();

		expect(panel.parentElement).toBe(document.body);

		const rangeEnd = panel.querySelector<HTMLButtonElement>('[data-value="2000-01-14"]');

		if (!rangeEnd) throw new Error('Initial date range did not select the visible month.');

		rangeEnd.click();

		await Promise.resolve();

		expect(picker.open).toBe(true);

		picker.open = false;

		await Promise.resolve();

		expect(panel.parentElement).toBe(picker);

		expect(panel.hidden).toBe(true);

		picker.open = true;

		await Promise.resolve();

		expect(panel.parentElement).toBe(document.body);

		picker.remove();

		expect(panel.parentElement).toBe(picker);

		expect(panel.hidden).toBe(true);
	});
});
