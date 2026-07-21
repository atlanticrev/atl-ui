import { altIconMarkup } from '../../../src';

import { customIconMarkup } from '../custom-icon';
import { example, defineStory } from '../story-factory';

const expanded = `
<aside class="alt-sidebar">
	<strong class="alt-sidebar__header">Workspace</strong>
	<nav class="alt-sidebar__group">
		<a class="alt-sidebar__item" aria-current="page" href="#sidebar">Overview</a>
		<a class="alt-sidebar__item" href="#sidebar">Posts</a>
		<a class="alt-sidebar__item" href="#sidebar">Analytics</a>
	</nav>
	<nav class="alt-sidebar__group" data-position="footer">
		<a class="alt-sidebar__item" href="#sidebar">Settings</a>
	</nav>
</aside>`;

const collapsed = `
<aside class="alt-sidebar" data-collapsed="true">
	<strong class="alt-sidebar__header">ATL</strong>
	<nav class="alt-sidebar__group" aria-label="Collapsed navigation">
		<a class="alt-sidebar__item" aria-current="page" href="#sidebar" aria-label="Overview">
			${altIconMarkup('home')}
		</a>
		<a class="alt-sidebar__item" href="#sidebar" aria-label="Posts">${altIconMarkup('grid')}</a>
		<a class="alt-sidebar__item" href="#sidebar" aria-label="Analytics">${customIconMarkup}</a>
	</nav>
</aside>`;

export const sidebarStory = defineStory({
	id: 'sidebar',
	title: 'Sidebar',
	group: 'Native CSS',
	summary: 'Flexible light-DOM navigation with selected, collapsed and footer-group layouts.',
	examples: [
		example('Expanded', expanded, 'Header, active item and footer group.'),
		example('Collapsed', collapsed, 'Compact icon navigation.'),
		example(
			'Long navigation label',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<aside class="alt-sidebar" style="--alt-sidebar-width: 100%">
		<strong class="alt-sidebar__header">Very-long-workspace-identifier</strong>
		<nav class="alt-sidebar__group">
			<a class="alt-sidebar__item" href="#sidebar">All-scheduled-cross-channel-publications</a>
		</nav>
	</aside>
</div>`,
			'Consumer navigation stays within its assigned width.',
		),
	],
});
