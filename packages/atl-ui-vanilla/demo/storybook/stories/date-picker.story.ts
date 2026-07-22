import type { AltDateRangePickerElementApi } from '../../../src';
import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

export const datePickerStory = defineStory({
	id: 'date-picker',
	title: 'Date Picker',
	group: 'Complex',
	summary: 'Form-ready single-date and range pickers backed by the shared calendar.',
	examples: [
		example(
			'Single date',
			'<alt-date-picker name="publishDate" placeholder="Publication date" value="2026-07-22"></alt-date-picker>',
			'Selecting a day commits immediately.',
		),
		example(
			'Date range',
			'<alt-date-range-picker data-range-picker name="from" name-end="to" start="2026-07-01" end="2026-07-22"></alt-date-range-picker>',
			'Range selection uses explicit Apply and exposes two native form values.',
			true,
		),
		example(
			'Date of birth',
			'<alt-date-picker initial-view="years" max="2008-07-22" min="1900-01-01" name="birthDate" placeholder="Date of birth"></alt-date-picker>',
			'An initial year view and bounds cover the DOB flow.',
		),
		example(
			'States',
			`<div class="alt-catalog-story-stack">
	<alt-date-picker disabled value="2026-07-22"></alt-date-picker>
	<alt-date-picker required placeholder="Required date"></alt-date-picker>
</div>`,
			'Disabled and required form states.',
		),
	],
	setup: (root) => {
		const range = findElement<AltDateRangePickerElementApi>(root, '[data-range-picker]');

		range.presets = [
			{ end: '2026-07-22', label: 'Current week', start: '2026-07-20' },
			{ end: '2026-07-31', label: 'Current month', start: '2026-07-01' },
			{ end: '2026-12-31', label: 'Current year', start: '2026-01-01' },
			{ label: 'All time', start: '2024-01-01' },
		];
	},
});
