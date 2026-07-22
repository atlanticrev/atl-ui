import { altIconMarkup, type AltSelectElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElements } from '../dom';
import { channelOptions, longOption } from '../fixtures';
import { example, defineStory } from '../story-factory';

const sizes = `
<div class="alt-catalog-story-stack">
	<alt-select data-channel-options label="Extra large" size="xl" value="youtube"></alt-select>
	<alt-select data-channel-options label="Large" size="l" value="youtube"></alt-select>
	<alt-select data-channel-options label="Medium" size="m" value="youtube"></alt-select>
	<alt-select data-channel-options label="Small" size="s" value="youtube"></alt-select>
	<alt-select data-channel-options label="Extra small" size="xs" value="youtube"></alt-select>
</div>`;

const states = `
<div class="alt-catalog-story-stack">
	<alt-select data-channel-options label="Default" placeholder="Choose channel"></alt-select>
	<alt-select data-channel-options helper-text="Selection required" label="Error" status="error"></alt-select>
	<alt-select data-channel-options helper-text="Connected" label="Success" status="success" value="youtube"></alt-select>
	<alt-select data-channel-options disabled label="Disabled" value="tiktok"></alt-select>
	<alt-select data-channel-options label="Read only" readonly value="instagram"></alt-select>
</div>`;

const composition = `
<div class="alt-catalog-story-stack">
	<alt-select data-channel-options label="Custom trigger" value="youtube">
		<button class="alt-button" data-alt-select-trigger data-variant="outlined" type="button">
			<span aria-hidden="true">${altIconMarkup('grid', 18)}</span>
			<span data-alt-select-label>Publish to</span>
			<strong data-alt-select-value>Choose channel</strong>
			<span data-alt-select-indicator>${altIconMarkup('chevron-down', 18)}</span>
		</button>
	</alt-select>
	<alt-select data-channel-options data-multiple label="Multiple" multiple></alt-select>
	<alt-select data-channel-options data-custom-indicator label="Custom indicator" value="tiktok"></alt-select>
</div>`;

const overflow = `
<div class="alt-catalog-stress-frame" data-overlay-clip data-width="narrow">
	<alt-select data-long-option label="Long selected value" value="long-option"></alt-select>
</div>`;

export const selectStory = defineStory({
	id: 'select',
	title: 'Select',
	group: 'Complex',
	summary: 'Custom, form-associated select with arbitrary triggers, rich options and multiple selection.',
	examples: [
		example('Sizes', sizes, 'All public sizes with the same value.', true),
		example('States', states, 'Placeholder, status, disabled and readonly.', true),
		example('Composition', composition, 'Custom trigger and multiple selection.', true),
		example('Long content and narrow container', overflow, 'Selected labels ellipsize without moving actions.'),
	],
	setup: (root) => {
		for (const select of findElements<AltSelectElementApi>(root, '[data-channel-options]')) {
			select.options = channelOptions;
		}

		for (const select of findElements<AltSelectElementApi>(root, '[data-multiple]')) {
			select.values = ['youtube', 'instagram'];
		}

		for (const select of findElements<AltSelectElementApi>(root, '[data-custom-indicator]')) {
			select.indicatorIcon = createCustomIcon(document);

			select.leadingIcon = createCustomIcon(document);

			select.options = channelOptions.map((option) =>
				option.value === 'tiktok' ? { ...option, checkIcon: createCustomIcon(document) } : option,
			);
		}

		for (const select of findElements<AltSelectElementApi>(root, '[data-long-option]')) {
			select.options = [longOption];
		}
	},
});
