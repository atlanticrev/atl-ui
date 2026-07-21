import type { AltPopupElementApi } from '../../../src';
import { findElement, findElements } from '../dom';
import { example, defineStory } from '../story-factory';

const placementPopup = (placement: string): string => `
<span>
	<button
		class="alt-button"
		data-popup-target="popup-${placement}"
		data-variant="outlined"
		id="popup-anchor-${placement}"
		type="button"
	>
		${placement}
	</button>
	<alt-popup anchor-id="popup-anchor-${placement}" id="popup-${placement}" placement="${placement}">
		<div class="alt-card">Popup at ${placement}</div>
	</alt-popup>
</span>`;

const placements = `
<div class="alt-catalog-story-row">
	${placementPopup('bottom-start')}
	${placementPopup('bottom-end')}
	${placementPopup('top-start')}
	${placementPopup('top-end')}
</div>`;

const behavior = `
<div class="alt-catalog-story-row">
	<span>
		<button
			class="alt-button"
			data-popup-target="popup-persistent"
			data-variant="tonal"
			id="popup-anchor-persistent"
		>Persistent</button>
		<alt-popup
			anchor-id="popup-anchor-persistent"
			close-on-escape="false"
			close-on-outside-click="false"
			gap="12"
			id="popup-persistent"
		><div class="alt-card">Only the trigger closes this popup.</div></alt-popup>
	</span>
</div>`;

const overflow = `
<span>
	<button class="alt-button" data-popup-target="popup-overflow" id="popup-anchor-overflow">
		Open long popup
	</button>
	<alt-popup anchor-id="popup-anchor-overflow" id="popup-overflow">
		<div class="alt-card" style="max-width: 220px">
			https://example.com/a/very/long/path/without/spaces
		</div>
	</alt-popup>
</span>`;

export const popupStory = defineStory({
	id: 'popup',
	title: 'Popup',
	group: 'Behavioral',
	summary: 'Light-DOM popup anchored to any element with positioning, flip and dismiss controls.',
	examples: [
		example('Placements', placements, 'Start/end alignment above and below the anchor.', true),
		example('Dismiss behavior', behavior, 'Custom gap and persistent mode.'),
		example('Long content', overflow, 'Popup content stays within the viewport.'),
	],
	setup: (root) => {
		for (const button of findElements<HTMLButtonElement>(root, '[data-popup-target]')) {
			button.addEventListener('click', () => {
				const id = button.dataset.popupTarget ?? '';
				findElement<AltPopupElementApi>(root, `#${id}`).toggle();
			});
		}
	},
});
