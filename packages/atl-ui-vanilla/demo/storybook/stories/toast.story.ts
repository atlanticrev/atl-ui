import type { AltToastElementApi, AltToastStatus } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement, findElements } from '../dom';
import { example, defineStory } from '../story-factory';

const statuses = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-toast-status="info" data-variant="outlined">Info</button>
	<button class="alt-button" data-toast-status="success" data-variant="outlined">Success</button>
	<button class="alt-button" data-toast-status="warning" data-variant="outlined">Warning</button>
	<button class="alt-button" data-toast-status="error" data-variant="outlined">Error</button>
</div>`;

const policies = `
<div class="alt-catalog-story-row">
	<button class="alt-button" data-toast-action="persistent" data-variant="tonal">Persistent</button>
	<button class="alt-button" data-toast-action="locked" data-variant="tonal">Not dismissible</button>
	<button class="alt-button" data-toast-action="duplicate" data-variant="tonal">Prevent duplicate</button>
	<button class="alt-button" data-toast-action="custom" data-variant="tonal">Custom icon</button>
	<button class="alt-button" data-toast-action="burst" data-variant="filled">Push five</button>
	<button class="alt-button" data-toast-action="clear" data-variant="text">Clear all</button>
</div>`;

const overflow = `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<button class="alt-button" data-toast-action="long" data-variant="outlined">Show long notification</button>
</div>`;

const getRegion = (): AltToastElementApi => findElement(document, '#catalog-toasts');

export const toastStory = defineStory({
	id: 'toast',
	title: 'Toast',
	group: 'Complex',
	summary: 'Queued notifications with statuses, timers, pause, deduplication, overflow and dismissal.',
	examples: [
		example('Statuses', statuses, 'Status color and icon are announced through one region.', true),
		example('Queue policies', policies, 'Persistent, locked, duplicate, overflow and clear.', true),
		example('Long message', overflow, 'Long words and URLs wrap inside the notification.'),
	],
	setup: (root) => {
		for (const button of findElements<HTMLButtonElement>(root, '[data-toast-status]')) {
			button.addEventListener('click', () => {
				const status = button.dataset.toastStatus as AltToastStatus;

				getRegion().push({ message: `${button.textContent} notification`, status });
			});
		}

		for (const button of findElements<HTMLButtonElement>(root, '[data-toast-action]')) {
			button.addEventListener('click', () => handleToastAction(button.dataset.toastAction ?? ''));
		}
	},
});

const handleToastAction = (action: string): void => {
	const region = getRegion();

	if (action === 'clear') {
		region.clear();

		return;
	}

	if (action === 'persistent') region.push({ message: 'Persistent toast', persist: true });

	if (action === 'locked') region.push({ dismissible: false, message: 'Wait for timeout' });

	if (action === 'duplicate') {
		region.push({ id: 'deduplicated', message: 'Only one copy', preventDuplicate: true });
	}

	if (action === 'custom') {
		region.push({
			dismissIcon: createCustomIcon(document),
			icon: createCustomIcon(document),
			message: 'Consumer-provided SVG',
		});
	}

	if (action === 'long') {
		region.push({
			message: 'Publication failed: https://example.com/a/very/long/path/without/spaces',
			persist: true,
			status: 'error',
		});
	}

	if (action === 'burst') {
		for (let index = 1; index <= 5; index += 1) region.push(`Queued notification ${index}`);
	}
};
