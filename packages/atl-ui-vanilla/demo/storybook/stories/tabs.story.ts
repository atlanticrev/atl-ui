import { customIconMarkup } from '../custom-icon';
import { example, defineStory } from '../story-factory';

const tabs = (attributes = ''): string => `
<alt-tabs active-key="overview" ${attributes}>
	<div role="tablist" aria-label="Campaign views">
		<button data-key="overview" role="tab">Overview</button>
		<button data-key="posts" role="tab">Posts</button>
		<button data-key="analytics" role="tab">${customIconMarkup} Analytics</button>
	</div>
	<section data-key="overview" role="tabpanel">Overview panel</section>
	<section data-key="posts" role="tabpanel">Posts panel</section>
	<section data-key="analytics" role="tabpanel">Analytics panel</section>
</alt-tabs>`;

export const tabsStory = defineStory({
	id: 'tabs',
	title: 'Tabs',
	group: 'Behavioral',
	summary: 'Behavioral tabs enhance authored tablists and panels with keyboard navigation.',
	examples: [
		example('Horizontal', tabs(), 'Arrow keys, Home and End.', true),
		example('Compact', tabs('data-size="32"'), '32 px tab controls.', true),
		example('Vertical', tabs('data-orientation="vertical"'), 'Vertical authored composition.', true),
		example(
			'Disabled tab',
			`
<alt-tabs active-key="first">
	<div role="tablist"><button data-key="first" role="tab">First</button>
		<button data-key="second" disabled role="tab">Disabled</button>
		<button data-key="third" role="tab">Third</button></div>
	<p data-key="first" role="tabpanel">First panel</p>
	<p data-key="second" role="tabpanel">Disabled panel</p>
	<p data-key="third" role="tabpanel">Third panel</p>
</alt-tabs>`,
			undefined,
			true,
		),
		example(
			'Long labels and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-tabs active-key="overview">
		<div role="tablist" aria-label="Long campaign views">
			<button data-key="overview" role="tab">All publication overview metrics</button>
			<button data-key="audience" role="tab">Audience breakdown by channel</button>
		</div>
		<section data-key="overview" role="tabpanel">Overview</section>
		<section data-key="audience" role="tabpanel">Audience</section>
	</alt-tabs>
</div>`,
			'The tablist scrolls without widening the page.',
			true,
		),
	],
});
