import { type AltDrawerElementApi, altIconMarkup } from '../../../src';
import { findElement, findElements } from '../dom';
import { defineStory, example } from '../story-factory';

const closeButton = `
<button class="alt-button" data-alt-drawer-close data-elevation="none" data-icon-only data-size="32" data-variant="text" aria-label="Close">
	${altIconMarkup('close', 18)}
</button>`;

const navigation = `
<aside class="alt-sidebar alt-drawer-demo__sidebar">
	<strong class="alt-sidebar__header">Control center</strong>
	<nav class="alt-sidebar__group" aria-label="Workspace navigation">
		<a class="alt-sidebar__item" aria-current="page" href="#drawer">Overview</a>
		<a class="alt-sidebar__item" href="#drawer">Accounts</a>
		<a class="alt-sidebar__item" href="#drawer">Publish</a>
		<a class="alt-sidebar__item" href="#drawer">Scheduler</a>
	</nav>
	<nav class="alt-sidebar__group" data-position="footer">
		<a class="alt-sidebar__item" href="#drawer">Settings</a>
	</nav>
</aside>`;

const drawers = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-drawer-target="drawer-left" data-variant="filled">Open left drawer</button>
	<button class="alt-button" data-drawer-target="drawer-right" data-variant="outlined">Open right drawer</button>
</div>
<alt-drawer id="drawer-left" labelled-by="drawer-left-title" placement="left">
	<header class="alt-drawer__header">
		<h2 class="alt-drawer__title" id="drawer-left-title">Menu</h2>
		${closeButton}
	</header>
	<div class="alt-drawer__body">${navigation}</div>
</alt-drawer>
<alt-drawer id="drawer-right" labelled-by="drawer-right-title" placement="right">
	<header class="alt-drawer__header">
		<h2 class="alt-drawer__title" id="drawer-right-title">Activity</h2>
		${closeButton}
	</header>
	<div class="alt-drawer__body alt-drawer-demo__copy">
		<p>Right-side contextual content uses the same modal and swipe lifecycle.</p>
		<p>Swipe towards the right edge to dismiss it on a touch screen.</p>
	</div>
</alt-drawer>`;

const sheets = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-drawer-target="sheet-bottom" data-variant="filled">Open bottom sheet</button>
	<button class="alt-button" data-drawer-target="sheet-top" data-variant="tonal">Open top sheet</button>
</div>
<alt-drawer id="sheet-bottom" labelled-by="sheet-bottom-title" placement="bottom">
	<div class="alt-drawer__handle" data-alt-drawer-handle aria-hidden="true"></div>
	<header class="alt-drawer__header">
		<h2 class="alt-drawer__title" id="sheet-bottom-title">Schedule publication</h2>
		${closeButton}
	</header>
	<div class="alt-drawer__body alt-drawer-demo__form" data-alt-drawer-scroll>
		<alt-input label="Post title" value="Summer campaign"></alt-input>
		<alt-select label="Channel">
			<alt-option value="youtube">YouTube</alt-option>
			<alt-option value="tiktok">TikTok</alt-option>
		</alt-select>
		<p>Drag the handle down, or drag the content when it is scrolled to its top boundary.</p>
	</div>
	<footer class="alt-drawer__footer">
		<button class="alt-button" data-alt-drawer-close data-variant="text">Cancel</button>
		<button class="alt-button" data-alt-drawer-close="scheduled" data-variant="filled">Schedule</button>
	</footer>
</alt-drawer>
<alt-drawer id="sheet-top" labelled-by="sheet-top-title" placement="top">
	<header class="alt-drawer__header">
		<h2 class="alt-drawer__title" id="sheet-top-title">Connection restored</h2>
		${closeButton}
	</header>
	<div class="alt-drawer__body alt-drawer-demo__copy" data-alt-drawer-scroll>
		<p>The top sheet uses the same component and closes with an upward swipe.</p>
	</div>
	<div class="alt-drawer__handle" data-alt-drawer-handle aria-hidden="true"></div>
</alt-drawer>`;

export const drawerStory = defineStory({
	id: 'drawer',
	title: 'Drawer and sheets',
	group: 'Behavioral',
	summary: 'One native modal component with side drawers and top or bottom touch-dismissable sheets.',
	examples: [
		example('Drawer — left and right', drawers, 'Side panels preserve the native mobile navigation motion.', true),
		example(
			'Mobile sheets — bottom and top',
			sheets,
			'Vertical variants share the lifecycle and gesture math.',
			true,
		),
	],
	setup: (root) => {
		for (const button of findElements<HTMLButtonElement>(root, '[data-drawer-target]')) {
			button.addEventListener('click', () => {
				const id = button.dataset.drawerTarget ?? '';

				findElement<AltDrawerElementApi>(root, `#${id}`).showModal();
			});
		}
	},
});
