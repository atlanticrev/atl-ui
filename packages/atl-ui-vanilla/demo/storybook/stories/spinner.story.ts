import { example, defineStory } from '../story-factory';

export const spinnerStory = defineStory({
	id: 'spinner',
	title: 'Spinner',
	group: 'Native CSS',
	summary: 'Reduced-motion-aware busy indicator in three sizes.',
	examples: [
		example(
			'Sizes',
			`<div style="display:flex;align-items:center;gap:1rem">
	<span class="alt-spinner" data-size="sm" role="status" aria-label="Loading"></span>
	<span class="alt-spinner" role="status" aria-label="Loading"></span>
	<span class="alt-spinner" data-size="lg" role="status" aria-label="Loading"></span>
</div>`,
		),
	],
});
