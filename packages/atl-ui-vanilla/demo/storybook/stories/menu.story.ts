import { example, defineStory } from '../story-factory';

export const menuStory = defineStory({
	id: 'menu',
	title: 'Menu',
	group: 'Behavioral',
	summary: 'Accessible action menu over authored trigger and menu items.',
	examples: [
		example(
			'Actions',
			`<alt-menu>
	<button class="alt-button" data-alt-menu-trigger type="button">Campaign actions</button>
	<div role="menu" aria-label="Campaign actions">
		<button data-value="edit" role="menuitem" type="button">Edit campaign</button>
		<button data-value="duplicate" role="menuitem" type="button">Duplicate</button>
		<button data-tone="danger" data-value="delete" role="menuitem" type="button">Delete</button>
	</div>
</alt-menu>`,
			'Arrow keys, Home, End, Escape and outside-click dismissal.',
		),
		example(
			'Clipping container',
			`<div class="alt-catalog-stress-frame" data-overlay-clip>
	<alt-menu>
		<button class="alt-button" data-alt-menu-trigger type="button">Clipped menu</button>
		<div role="menu" aria-label="Clipped actions">
			<button data-value="edit" role="menuitem" type="button">Edit campaign</button>
			<button data-value="duplicate" role="menuitem" type="button">Duplicate campaign</button>
			<button data-value="delete" role="menuitem" type="button">Delete campaign</button>
		</div>
	</alt-menu>
</div>`,
			'Menu uses the shared top layer instead of the local stacking context.',
		),
	],
});
