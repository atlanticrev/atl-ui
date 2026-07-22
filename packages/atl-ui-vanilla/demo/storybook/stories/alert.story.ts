import type { AltAlertElementApi, AltAlertSeverity, AltAlertVariant } from '../../../src';
import { customIconMarkup } from '../custom-icon';
import { findElement, findElements } from '../dom';
import { defineStory, example } from '../story-factory';

const severities: readonly AltAlertSeverity[] = ['success', 'info', 'warning', 'error'];
const variants: readonly AltAlertVariant[] = ['standard', 'outlined', 'filled'];

const renderAlert = (severity: AltAlertSeverity, variant: AltAlertVariant = 'standard'): string => `
	<alt-alert severity="${severity}" variant="${variant}">
		<span class="alt-alert__title">${severity[0].toUpperCase()}${severity.slice(1)}</span>
		This is a ${variant} ${severity} alert.
	</alt-alert>`;

const statusExamples = `
<div class="alt-catalog-story-stack">
	${severities.map((severity) => renderAlert(severity)).join('')}
</div>`;

const variantExamples = `
<div class="alt-catalog-story-stack">
	${variants.flatMap((variant) => severities.map((severity) => renderAlert(severity, variant))).join('')}
</div>`;

const actionExamples = `
<div class="alt-catalog-story-stack">
	<alt-alert dismissible severity="warning" data-dismissible-alert>
		<span class="alt-alert__title">Schedule conflict</span>
		This post overlaps another publication.
	</alt-alert>
	<button class="alt-button" data-alert-show type="button" data-variant="outlined">Show alert again</button>
	<alt-alert severity="success">
		Publication settings were saved.
		<button class="alt-button alt-alert__action-button" data-alt-alert-action data-elevation="none" data-size="32" data-variant="text" type="button">Undo</button>
	</alt-alert>
</div>`;

const customIcon = customIconMarkup.replace('<svg', '<svg data-alt-alert-icon');
const customizationExamples = `
<div class="alt-catalog-story-stack">
	<alt-alert color="warning" severity="success" variant="outlined">
		Success semantics with warning colors.
	</alt-alert>
	<alt-alert severity="info">
		${customIcon}
		A consumer-provided SVG icon.
	</alt-alert>
	<alt-alert data-alert-no-icon role="status" severity="info">
		A less urgent status without a visual icon.
	</alt-alert>
</div>`;

const longContent = `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-alert dismissible severity="error" variant="outlined">
		<span class="alt-alert__title">Publication failed for an unusually long channel name</span>
		https://example.com/a/very/long/path/without/spaces could not be reached. Check the channel settings.
	</alt-alert>
</div>`;

export const alertStory = defineStory({
	id: 'alert',
	title: 'Alert',
	group: 'Complex',
	summary: 'Inline feedback with severity, variants, titles, actions, custom SVG icons and dismissal.',
	examples: [
		example('Severities', statusExamples, 'Success, info, warning and error semantics.', true),
		example('Variants', variantExamples, 'Standard, outlined and filled designs.', true),
		example('Actions and dismissal', actionExamples, 'Custom actions replace the default close button.', true),
		example('Customization', customizationExamples, 'Independent color, custom icon and status role.', true),
		example('Long content', longContent, 'Long titles, text and URLs wrap without escaping the container.'),
	],
	setup: (root) => {
		const dismissibleAlert = findElement<AltAlertElementApi>(root, '[data-dismissible-alert]');

		findElement<HTMLButtonElement>(root, '[data-alert-show]').addEventListener('click', () => {
			dismissibleAlert.show();
		});

		for (const alert of findElements<AltAlertElementApi>(root, '[data-alert-no-icon]')) alert.icon = null;
	},
});
