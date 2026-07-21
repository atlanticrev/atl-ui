import { example, defineStory } from '../story-factory';

export const cardStory = defineStory({
	id: 'card',
	title: 'Card',
	group: 'Native CSS',
	summary: 'Surface containers remain ordinary semantic HTML and accept any light-DOM content.',
	examples: [
		example('Default', '<article class="alt-card"><strong>Default card</strong><p>Border and shadow.</p></article>'),
		example('Flat', `
<article class="alt-card" data-variant="flat">
	<strong>Flat card</strong><p>Border without elevation.</p>
</article>`),
		example('Soft', `
<article class="alt-card" data-variant="soft">
	<strong>Soft card</strong><p>Muted surface without border.</p>
</article>`),
		example('Composed content', `
<article class="alt-card alt-catalog-story-stack">
	<header><strong>Scheduled post</strong><p>Today at 18:30</p></header>
	<p>Cards do not own markup, so product content stays flexible.</p>
	<footer class="alt-catalog-story-row">
		<button class="alt-button" data-variant="filled">Open</button>
		<button class="alt-button" data-variant="text">Dismiss</button>
	</footer>
</article>`, undefined, true),
		example('Long unbroken content', `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<article class="alt-card">
		<strong>Long content</strong>
		<p>https://example.com/campaigns/a-very-long-unbroken-campaign-identifier</p>
	</article>
</div>`, 'Cards keep arbitrary consumer content inside their boundary.'),
	],
});
