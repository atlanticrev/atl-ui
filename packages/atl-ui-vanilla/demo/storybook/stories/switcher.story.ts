import { example, defineStory } from '../story-factory';

export const switcherStory = defineStory({
	id: 'switcher',
	title: 'Switcher',
	group: 'Native CSS',
	summary: 'Native checkbox exposed as a switch, including size, disabled and validation states.',
	examples: [
		example('States', `
<div class="alt-catalog-story-stack">
	<label class="alt-switcher">
		<input class="alt-switcher__control" role="switch" type="checkbox" />Off
	</label>
	<label class="alt-switcher">
		<input class="alt-switcher__control" role="switch" checked type="checkbox" />On
	</label>
	<label class="alt-switcher">
		<input class="alt-switcher__control" role="switch" checked disabled type="checkbox" />Disabled
	</label>
</div>`),
		example('Medium and invalid', `
<div class="alt-catalog-story-stack">
	<label class="alt-switcher" data-size="m">
		<input class="alt-switcher__control" role="switch" checked type="checkbox" />Medium
	</label>
	<label class="alt-switcher" data-size="m">
		<input class="alt-switcher__control" role="switch" aria-invalid="true" type="checkbox" />Invalid
	</label>
	</div>`),
		example('Long label', `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<label class="alt-switcher">
		<input class="alt-switcher__control" role="switch" type="checkbox" />
		Visible-in-every-selected-channel-and-all-derived-publications
	</label>
</div>`, 'The switch remains usable while its label wraps.'),
	],
});
