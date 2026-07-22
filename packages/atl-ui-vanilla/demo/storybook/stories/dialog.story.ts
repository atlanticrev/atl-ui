import { type AltDialogElementApi, altIconMarkup } from '../../../src';
import { customIconMarkup } from '../custom-icon';
import { findElement, findElements } from '../dom';
import { defineStory, example } from '../story-factory';

const dialog = (size: number): string => `
<button class="alt-button" data-dialog-target="dialog-${size}" data-variant="outlined" type="button">
	${size} px
</button>
<alt-dialog id="dialog-${size}" size="${size}">
	<header class="alt-dialog__header">
		<h2 class="alt-dialog__title">${size} px dialog</h2>
		<button class="alt-button alt-dialog__close" data-alt-dialog-close data-elevation="none" data-icon-only data-size="32" data-variant="text" aria-label="Close">
			${size === 520 ? customIconMarkup : altIconMarkup('close', 18)}
		</button>
	</header>
	<div class="alt-dialog__body">Native dialog focus, Escape and focus restoration.</div>
	<footer class="alt-dialog__footer">
		<button class="alt-button" data-alt-dialog-close data-variant="text">Cancel</button>
		<button class="alt-button" data-alt-dialog-close data-variant="filled">Confirm</button>
	</footer>
</alt-dialog>`;

const sizes = `
<div class="alt-catalog-story-row">
	${dialog(520)}
	${dialog(620)}
	${dialog(760)}
	${dialog(848)}
</div>`;

const strict = `
<button class="alt-button" data-dialog-target="dialog-strict" data-variant="tonal">Open strict dialog</button>
<alt-dialog close-on-backdrop="false" close-on-escape="false" id="dialog-strict" size="520">
	<header class="alt-dialog__header"><h2 class="alt-dialog__title">Explicit decision</h2></header>
	<div class="alt-dialog__body">Backdrop and Escape do not close this variant.</div>
	<footer class="alt-dialog__footer">
		<button class="alt-button" data-alt-dialog-close data-variant="filled">Continue</button>
	</footer>
</alt-dialog>`;

const overflow = `
<button class="alt-button" data-dialog-target="dialog-overflow" data-variant="outlined">Open long content</button>
<alt-dialog id="dialog-overflow" size="520">
	<header class="alt-dialog__header">
		<h2 class="alt-dialog__title">Very-long-unbroken-dialog-decision-title-for-a-narrow-viewport</h2>
		<button class="alt-button alt-dialog__close" data-alt-dialog-close data-elevation="none" data-icon-only data-size="32" data-variant="text" aria-label="Close">
			${altIconMarkup('close', 18)}
		</button>
	</header>
	<div class="alt-dialog__body">
		Details stay readable: https://example.com/a/very/long/path/without/spaces
	</div>
	<footer class="alt-dialog__footer">
		<button class="alt-button" data-alt-dialog-close data-variant="text">Keep editing this publication</button>
		<button class="alt-button" data-alt-dialog-close data-variant="filled">Confirm every selected channel</button>
	</footer>
</alt-dialog>`;

const nestedOverlay = `
<button class="alt-button" data-dialog-target="dialog-overlay" data-variant="outlined">
	Open overlay dialog
</button>
<alt-dialog id="dialog-overlay" size="520">
	<dialog aria-labelledby="dialog-overlay-title">
		<header class="alt-dialog__header">
			<h2 class="alt-dialog__title" id="dialog-overlay-title">Overlay inside dialog</h2>
			<button class="alt-button alt-dialog__close" data-alt-dialog-close data-elevation="none" data-icon-only data-size="32" data-variant="text" aria-label="Close">
				${altIconMarkup('close', 18)}
			</button>
		</header>
		<div class="alt-dialog__body">
			<alt-select label="Channel">
				<alt-option value="youtube">YouTube</alt-option>
				<alt-option value="tiktok">TikTok</alt-option>
			</alt-select>
		</div>
	</dialog>
</alt-dialog>`;

export const dialogStory = defineStory({
	id: 'dialog',
	title: 'Dialog',
	group: 'Behavioral',
	summary: 'Native modal dialog with authored content, four sizes and configurable dismiss behavior.',
	examples: [
		example('Sizes', sizes, '520, 620, 760 and 848 px.', true),
		example('Strict dismiss', strict, 'Requires an explicit action.'),
		example('Nested overlay', nestedOverlay, 'Anchored overlays remain above their modal dialog.'),
		example('Long content', overflow, 'Title, body and actions reflow on narrow viewports.', true),
	],
	setup: (root) => {
		for (const button of findElements<HTMLButtonElement>(root, '[data-dialog-target]')) {
			button.addEventListener('click', () => {
				const id = button.dataset.dialogTarget ?? '';

				findElement<AltDialogElementApi>(root, `#${id}`).showModal();
			});
		}
	},
});
