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
			'<form><alt-date-picker name="publishDate" value="2026-07-22"></alt-date-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-picker') as HTMLElement;

		const change = vi.fn();

		picker.addEventListener('alt-change', change);

		picker.querySelector<HTMLButtonElement>('.alt-date-picker__trigger')?.click();

		await Promise.resolve();

		picker.querySelector<HTMLButtonElement>('[data-value="2026-07-23"]')?.click();

		await Promise.resolve();

		expect(picker.getAttribute('value')).toBe('2026-07-23');

		expect(change).toHaveBeenCalledOnce();

		expect(new FormData(document.querySelector('form') as HTMLFormElement).get('publishDate')).toBe('2026-07-23');

		expect(picker.hasAttribute('open')).toBe(false);
	});

	it('submits both range values only after a complete selection', async () => {
		document.body.innerHTML =
			'<form><alt-date-range-picker name="from" name-end="to" start="2026-07-10"></alt-date-range-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-range-picker') as AltDateRangePickerElementApi;

		const changed = vi.fn();

		picker.addEventListener('alt-change', changed);

		picker.open = true;

		await Promise.resolve();

		picker.querySelector<HTMLButtonElement>('[data-value="2026-07-14"]')?.click();

		await Promise.resolve();

		expect(changed).not.toHaveBeenCalled();

		picker.querySelector<HTMLButtonElement>('[data-action="apply"]')?.click();

		await Promise.resolve();

		const data = new FormData(document.querySelector('form') as HTMLFormElement);

		expect(data.get('from')).toBe('2026-07-10');

		expect(data.get('to')).toBe('2026-07-14');

		expect(changed).toHaveBeenCalledOnce();
	});

	it('restores authored defaults on native form reset', async () => {
		document.body.innerHTML = '<form><alt-date-picker name="date" value="2026-07-22"></alt-date-picker></form>';

		await Promise.resolve();

		const picker = document.querySelector('alt-date-picker') as HTMLElement & { value: string | null };

		picker.value = '2026-07-23';

		(document.querySelector('form') as HTMLFormElement).reset();

		await Promise.resolve();

		expect(picker.value).toBe('2026-07-22');
	});
});
