import { example, defineStory } from '../story-factory';

export const radioStory = defineStory({
	id: 'radio',
	title: 'Radio',
	group: 'Native CSS',
	summary: 'Native radio groups preserve browser forms and keyboard selection.',
	examples: [
		example(
			'Radio group',
			`
<fieldset class="alt-catalog-story-stack">
	<legend>Publishing mode</legend>
	<label class="alt-radio"><input class="alt-radio__control" name="mode" checked type="radio" />Now</label>
	<label class="alt-radio"><input class="alt-radio__control" name="mode" type="radio" />Schedule</label>
	<label class="alt-radio"><input class="alt-radio__control" name="mode" disabled type="radio" />Draft</label>
</fieldset>`,
		),
		example(
			'Sizes and validation',
			`
<div class="alt-catalog-story-row">
	<label class="alt-radio" data-size="s"><input class="alt-radio__control" checked type="radio" />Small</label>
	<label class="alt-radio"><input class="alt-radio__control" checked type="radio" />Medium</label>
	<label class="alt-radio" data-size="l"><input class="alt-radio__control" checked type="radio" />Large</label>
	<label class="alt-radio"><input class="alt-radio__control" aria-invalid="true" type="radio" />Invalid</label>
	</div>`,
			undefined,
			true,
		),
		example(
			'Long label',
			`
<div class="alt-catalog-stress-frame" data-width="narrow">
	<label class="alt-radio">
		<input class="alt-radio__control" name="long-mode" type="radio" />
		Schedule-after-every-currently-running-publication-has-finished
	</label>
</div>`,
			'The label wraps without shrinking the radio control.',
		),
	],
});
