import type { AltCalendarElementApi } from '../../../src';
import { findElements } from '../dom';
import { defineStory, example } from '../story-factory';

export const calendarStory = defineStory({
	id: 'calendar',
	title: 'Calendar',
	group: 'Complex',
	summary: 'Locale-aware single and range calendars with day, month and year views.',
	examples: [
		example(
			'Single date',
			'<alt-calendar locale="en-GB" first-day="1" value="2026-07-22"></alt-calendar>',
			'Monday-first calendar with a selected date.',
			true,
		),
		example(
			'Date range and presets',
			'<alt-calendar data-range-calendar selection-mode="range" commit-mode="explicit" start="2026-07-08" end="2026-07-18"></alt-calendar>',
			'Range preview, reset/apply controls and consumer-defined shortcuts.',
			true,
		),
		example(
			'Month and year selection',
			`<alt-calendar view="months" value="2026-07-22"></alt-calendar>
<alt-calendar view="years" value="2026-07-22"></alt-calendar>`,
			'Every selector view available in the original library.',
			true,
		),
		example(
			'Bounded and disabled dates',
			'<alt-calendar data-weekdays-only min="2026-07-06" max="2026-07-31" value="2026-07-22"></alt-calendar>',
			'Min/max bounds plus a callback disable weekends.',
			true,
		),
	],
	setup: (root) => {
		for (const calendar of findElements<AltCalendarElementApi>(root, '[data-range-calendar]')) {
			calendar.presets = [
				{ end: '2026-07-22', label: 'Last 7 days', start: '2026-07-16' },
				{ end: '2026-07-31', label: 'This month', start: '2026-07-01' },
			];
		}

		for (const calendar of findElements<AltCalendarElementApi>(root, '[data-weekdays-only]')) {
			calendar.disabledDate = (value) => {
				const day = new Date(`${value}T00:00:00Z`).getUTCDay();

				return day === 0 || day === 6;
			};
		}
	},
});
