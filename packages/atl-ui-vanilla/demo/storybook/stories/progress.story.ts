import type { AltProgressElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

const statuses = `
<div class="alt-catalog-story-stack">
	<alt-progress label="Default" value="32"></alt-progress>
	<alt-progress label="Running" status="running" value="58"></alt-progress>
	<alt-progress label="Completed" status="completed" value="100"></alt-progress>
	<alt-progress label="Failed" status="failed" value="64"></alt-progress>
	<alt-progress label="Aborted" status="aborted" value="41"></alt-progress>
</div>`;

const modes = `
<div class="alt-catalog-story-stack">
	<alt-progress label="Medium" max="200" value="128"></alt-progress>
	<alt-progress label="Small" size="sm" value="72"></alt-progress>
	<alt-progress indeterminate label="Indeterminate"></alt-progress>
	<alt-progress aria-label="Progress without visible value" show-value="false" value="48"></alt-progress>
	<alt-progress data-progress-node value="86"></alt-progress>
</div>`;

const circular = `
<div style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap">
	<alt-progress aria-label="32 percent complete" shape="circular" show-value="false" value="32"></alt-progress>
	<alt-progress label="Processing" shape="circular" status="running" value="68"></alt-progress>
	<alt-progress aria-label="Loading" indeterminate shape="circular" show-value="false"></alt-progress>
</div>`;

export const progressStory = defineStory({
	id: 'progress',
	title: 'Progress',
	group: 'Complex',
	summary: 'Native progress semantics with determinate/indeterminate modes, sizes, labels and statuses.',
	examples: [
		example('Statuses', statuses, 'Default, running, completed, failed and aborted.', true),
		example('Modes and labels', modes, 'Custom max, sizes, hidden value and Node label.', true),
		example('Circular', circular, 'Determinate, labelled and indeterminate circular progress.', true),
		example(
			'Long label and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-progress label="Uploading-a-very-long-unbroken-media-identifier" value="84"></alt-progress>
</div>`,
			'The label wraps while the numeric value and track stay aligned.',
		),
	],
	setup: (root) => {
		const progress = findElement<AltProgressElementApi>(root, '[data-progress-node]');

		const label = document.createElement('span');

		label.append(createCustomIcon(document), ' Uploading media');

		progress.labelContent = label;
	},
});
