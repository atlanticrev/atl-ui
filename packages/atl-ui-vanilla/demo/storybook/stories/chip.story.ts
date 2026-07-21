import { altIconMarkup } from '../../../src';

import { customIconMarkup } from '../custom-icon';
import { example, defineStory } from '../story-factory';

export const chipStory = defineStory({
	id: 'chip',
	title: 'Chip',
	group: 'Native CSS',
	summary: 'Compact labels for statuses, filters and removable selections.',
	examples: [
		example(
			'Variants',
			`
<div class="alt-catalog-story-row">
	<span class="alt-chip">Default</span>
	<span class="alt-chip" data-variant="frozen">Frozen</span>
	<span class="alt-chip" data-variant="danger">Failed</span>
	<span class="alt-chip" aria-disabled="true">Disabled</span>
</div>`,
		),
		example(
			'Sizes and actions',
			`
<div class="alt-catalog-story-row">
	<span class="alt-chip" data-size="s">Small</span>
	<span class="alt-chip" data-variant="frozen">
		<span class="alt-chip__label">YouTube</span>
		<button class="alt-chip__remove" type="button" aria-label="Remove YouTube">
			${altIconMarkup('close', 14)}
		</button>
	</span>
	<span class="alt-chip" data-variant="danger">
		<span class="alt-chip__label">TikTok</span>
		<button class="alt-chip__remove" type="button" aria-label="Remove TikTok">
			${customIconMarkup}
		</button>
	</span>
</div>`,
		),
		example(
			'Long removable label',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<span class="alt-chip">
		<span class="alt-chip__label">A-very-long-channel-name-that-must-not-overflow</span>
		<button class="alt-chip__remove" type="button" aria-label="Remove channel">
			${altIconMarkup('close', 14)}
		</button>
	</span>
</div>`,
			'The label ellipsizes while the action remains visible.',
		),
	],
});
