import { altIconMarkup } from '../../../src';

import { customIconMarkup } from '../custom-icon';
import { example, defineStory } from '../story-factory';

const variants = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-variant="filled">Filled</button>
	<button class="alt-button" data-variant="tonal">Tonal</button>
	<button class="alt-button" data-variant="outlined">Outlined</button>
	<button class="alt-button" data-variant="text">Text</button>
	<button class="alt-button" data-variant="elevated">Elevated</button>
	<button class="alt-button" data-variant="danger">Danger</button>
</div>`;

const tones = `
<div class="alt-catalog-story-stack">
	<div class="alt-catalog-story-row">
		<span class="alt-catalog-story-label">Success</span>
		<button class="alt-button" data-tone="success" data-variant="filled">Filled</button>
		<button class="alt-button" data-tone="success" data-variant="tonal">Tonal</button>
		<button class="alt-button" data-tone="success" data-variant="outlined">Outlined</button>
	</div>
	<div class="alt-catalog-story-row">
		<span class="alt-catalog-story-label">Danger</span>
		<button class="alt-button" data-tone="danger" data-variant="filled">Filled</button>
		<button class="alt-button" data-tone="danger" data-variant="tonal">Tonal</button>
		<button class="alt-button" data-tone="danger" data-variant="outlined">Outlined</button>
	</div>
</div>`;

const sizes = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-size="48">48 px</button>
	<button class="alt-button">40 px</button>
	<button class="alt-button" data-size="32">32 px</button>
	<button class="alt-button" data-size="24">24 px</button>
</div>`;

const states = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-variant="filled">Enabled</button>
	<button class="alt-button" data-variant="filled" disabled>Disabled</button>
	<button class="alt-button" data-loading data-variant="filled" disabled>
		<span class="alt-button__loading-indicator" role="progressbar"></span>
		<span class="alt-button__content">Publishing</span>
	</button>
	<button class="alt-button" data-loading data-loading-position="end" data-variant="outlined">
		<span class="alt-button__content">Syncing</span>
		<span class="alt-button__loading-indicator" role="progressbar">${customIconMarkup}</span>
	</button>
</div>`;

const composition = `
<div class="alt-catalog-story-stack">
	<div class="alt-catalog-story-row">
		<button class="alt-button" data-icon-only aria-label="Add item">
			<span class="alt-button__icon">${altIconMarkup('plus')}</span>
		</button>
		<button class="alt-button" data-variant="outlined">
			<span class="alt-button__icon alt-button__icon--start">${altIconMarkup('arrow-left')}</span>
			<span class="alt-button__content">Previous</span>
		</button>
		<button class="alt-button" data-variant="filled">
			<span class="alt-button__content">Next</span>
			<span class="alt-button__icon alt-button__icon--end">${altIconMarkup('arrow-right')}</span>
		</button>
		<button class="alt-button" data-variant="tonal">
			<span class="alt-button__icon alt-button__icon--start">${customIconMarkup}</span>
			<span class="alt-button__content">Custom SVG</span>
		</button>
	</div>
	<div class="alt-button-group" role="group" aria-label="Editor mode">
		<button class="alt-button" data-variant="outlined">Write</button>
		<button class="alt-button" data-variant="outlined">Preview</button>
		<button class="alt-button" data-variant="outlined">History</button>
	</div>
</div>`;

export const buttonStory = defineStory({
	id: 'button',
	title: 'Button',
	group: 'Native CSS',
	summary: 'Native buttons with explicit variants, tones, sizes, states, icons and grouped composition.',
	examples: [
		example('Variants', variants, 'All visual variants.'),
		example('Semantic tones', tones, 'Tone and surface combinations.', true),
		example('Sizes', sizes),
		example('States', states, 'Disabled and loading positions.'),
		example('Icons and groups', composition, 'Icon-only, start/end icons and segmented groups.', true),
		example(
			'Long content and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<button class="alt-button" data-variant="filled">
		<span class="alt-button__content">Publish-to-every-selected-channel-without-losing-the-action</span>
	</button>
</div>`,
			'Important action labels wrap instead of being clipped.',
		),
	],
});
