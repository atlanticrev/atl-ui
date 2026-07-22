import type { AltTooltipElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

const placements = `
<div class="alt-catalog-story-row">
	<alt-tooltip placement="top" title="Top tooltip">
		<button class="alt-button" data-variant="outlined">Top</button>
	</alt-tooltip>
	<alt-tooltip placement="right" title="Right tooltip">
		<button class="alt-button" data-variant="outlined">Right</button>
	</alt-tooltip>
	<alt-tooltip placement="bottom" title="Bottom tooltip">
		<button class="alt-button" data-variant="outlined">Bottom</button>
	</alt-tooltip>
	<alt-tooltip placement="left" title="Left tooltip">
		<button class="alt-button" data-variant="outlined">Left</button>
	</alt-tooltip>
</div>`;

const triggers = `
<div class="alt-catalog-story-row">
	<alt-tooltip title="Visible on hover or focus" trigger="hover">
		<button class="alt-button" data-variant="outlined">Hover / focus</button>
	</alt-tooltip>
	<alt-tooltip title="Toggle on click" trigger="click">
		<button class="alt-button" data-variant="outlined">Click</button>
	</alt-tooltip>
	<alt-tooltip data-custom-tooltip trigger="click">
		<button class="alt-button" data-variant="tonal">Custom content</button>
	</alt-tooltip>
</div>`;

const overflow = `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-tooltip show-on-overflow title="Full value: all selected channels and derived publications">
		<span class="alt-catalog-truncated-text" data-alt-overflow-target tabindex="0">
			All selected channels and derived publications
		</span>
	</alt-tooltip>
</div>`;

export const tooltipStory = defineStory({
	id: 'tooltip',
	title: 'Tooltip',
	group: 'Behavioral',
	summary: 'Accessible hover/focus or click hints with four placements and Node content.',
	examples: [
		example('Placements', placements, 'Top, right, bottom and left.', true),
		example('Triggers and content', triggers, 'Hover/focus, click and custom Node content.', true),
		example('Truncated text', overflow, 'The complete value is available on hover and keyboard focus.'),
	],
	setup: (root) => {
		const tooltip = findElement<AltTooltipElementApi>(root, '[data-custom-tooltip]');

		const content = document.createElement('span');

		content.append(createCustomIcon(document), ' Rich content');

		tooltip.content = content;
	},
});
