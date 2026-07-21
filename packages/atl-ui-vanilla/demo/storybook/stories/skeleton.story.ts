import { example, defineStory } from '../story-factory';

export const skeletonStory = defineStory({
	id: 'skeleton',
	title: 'Skeleton',
	group: 'Native CSS',
	summary: 'Loading placeholders for lines, avatars, blocks, repeated content and overlays.',
	examples: [
		example('Shapes', `
<div class="alt-catalog-story-stack">
	<span class="alt-skeleton" data-shape="line" style="width: 16rem">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 10rem">&nbsp;</span>
	<span class="alt-skeleton" data-shape="circle" style="width: 48px">&nbsp;</span>
	<span class="alt-skeleton" style="width: 100%; height: 72px">&nbsp;</span>
</div>`),
		example('Repeated list', `
<div class="alt-skeleton-repeat" style="--alt-skeleton-repeat-gap: 0.75rem; width: 100%">
	<span class="alt-skeleton" data-shape="line" style="width: 100%">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 86%">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 72%">&nbsp;</span>
</div>`),
		example('Overlay composition', `
<div class="alt-skeleton-wrapper alt-card" style="width: 100%; min-height: 120px">
	<div class="alt-skeleton-wrapper__placeholder">Loaded card content</div>
	<span class="alt-skeleton" data-shape="overlay">&nbsp;</span>
</div>`, undefined, true),
		example('Narrow responsive placeholder', `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<div class="alt-skeleton-repeat" style="width: 100%">
		<span class="alt-skeleton" data-shape="line" style="width: 100%">&nbsp;</span>
		<span class="alt-skeleton" data-shape="line" style="width: 72%">&nbsp;</span>
	</div>
</div>`, 'Skeleton animation stays clipped to its own geometry.'),
	],
});
