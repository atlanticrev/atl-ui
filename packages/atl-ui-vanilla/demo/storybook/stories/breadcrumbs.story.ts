import { altIconMarkup } from '../../../src';

import { customIconMarkup } from '../custom-icon';
import { example, defineStory } from '../story-factory';

const trail = `
<nav class="alt-breadcrumbs" aria-label="Breadcrumb">
	<ol class="alt-breadcrumbs__list">
		<li class="alt-breadcrumbs__item">
			<a class="alt-breadcrumbs__link" href="#breadcrumbs">Workspace</a>
			<span class="alt-breadcrumbs__separator">${customIconMarkup}</span>
		</li>
		<li class="alt-breadcrumbs__item">
			<a class="alt-breadcrumbs__link" href="#breadcrumbs">Campaigns</a>
			<span class="alt-breadcrumbs__separator">${altIconMarkup('chevron-right', 16)}</span>
		</li>
		<li class="alt-breadcrumbs__current" aria-current="page">Summer launch</li>
	</ol>
</nav>`;

export const breadcrumbsStory = defineStory({
	id: 'breadcrumbs',
	title: 'Breadcrumbs',
	group: 'Native CSS',
	summary: 'Semantic navigation trails with links, separators and an accessible current page.',
	examples: [
		example('Full trail', trail, 'Three-level navigation.', true),
		example(
			'Compact trail',
			`
<nav class="alt-breadcrumbs" aria-label="Breadcrumb">
	<ol class="alt-breadcrumbs__list">
		<li class="alt-breadcrumbs__item">
			<a class="alt-breadcrumbs__link" href="#breadcrumbs">Library</a>
			<span class="alt-breadcrumbs__separator">${altIconMarkup('chevron-right', 16)}</span>
		</li>
		<li class="alt-breadcrumbs__current" aria-current="page">Components</li>
	</ol>
</nav>`,
		),
		example(
			'Long current page',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<nav class="alt-breadcrumbs" aria-label="Breadcrumb">
		<ol class="alt-breadcrumbs__list">
			<li class="alt-breadcrumbs__item"><a class="alt-breadcrumbs__link" href="#breadcrumbs">Library</a></li>
			<li class="alt-breadcrumbs__current" aria-current="page">Extremely-long-campaign-identifier-2026</li>
		</ol>
	</nav>
</div>`,
			'The current page ellipsizes inside its container.',
		),
	],
});
