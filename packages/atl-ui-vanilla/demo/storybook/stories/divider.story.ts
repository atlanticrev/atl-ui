import { example, defineStory } from '../story-factory';

export const dividerStory = defineStory({
	id: 'divider',
	title: 'Divider',
	group: 'Native CSS',
	summary: 'Horizontal and vertical separators using native semantics.',
	examples: [
		example('Horizontal', '<p>Summary</p><hr class="alt-divider"><p>Details</p>'),
		example(
			'Vertical',
			'<div style="display:flex;align-items:center">Left<hr aria-orientation="vertical" class="alt-divider" data-orientation="vertical">Right</div>',
		),
	],
});
