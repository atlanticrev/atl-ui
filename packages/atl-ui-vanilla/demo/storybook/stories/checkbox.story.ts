import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

export const checkboxStory = defineStory({
	id: 'checkbox',
	title: 'Checkbox',
	group: 'Native CSS',
	summary: 'Native checkbox behavior with custom visuals, sizes, validation and indeterminate state.',
	examples: [
		example(
			'Selection states',
			`
<div class="alt-catalog-story-stack">
	<label class="alt-checkbox"><input class="alt-checkbox__control" type="checkbox" />Unchecked</label>
	<label class="alt-checkbox"><input class="alt-checkbox__control" checked type="checkbox" />Checked</label>
	<label class="alt-checkbox">
		<input class="alt-checkbox__control" data-indeterminate type="checkbox" />Indeterminate
	</label>
</div>`,
		),
		example(
			'Size and validation',
			`
<div class="alt-catalog-story-stack">
	<label class="alt-checkbox" data-size="s">
		<input class="alt-checkbox__control" checked type="checkbox" />Small
	</label>
	<label class="alt-checkbox">
		<input class="alt-checkbox__control" aria-invalid="true" type="checkbox" />Invalid
	</label>
	<label class="alt-checkbox">
		<input class="alt-checkbox__control" disabled type="checkbox" />Disabled
	</label>
</div>`,
		),
		example(
			'Long label',
			`
<div class="alt-catalog-stress-frame" data-width="narrow">
	<label class="alt-checkbox">
		<input class="alt-checkbox__control" type="checkbox" />
		Publish-to-every-selected-channel-without-clipping-this-choice
	</label>
</div>`,
			'The native control remains fixed while its label wraps.',
		),
	],
	setup: (root) => {
		findElement<HTMLInputElement>(root, '[data-indeterminate]').indeterminate = true;
	},
});
