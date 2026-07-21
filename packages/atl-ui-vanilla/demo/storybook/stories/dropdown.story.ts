import type { AltDropdownElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElements } from '../dom';
import { channelOptions, longOption } from '../fixtures';
import { example, defineStory } from '../story-factory';

const single = `
<alt-dropdown aria-label="Channel options" data-dropdown-options></alt-dropdown>`;

const multiple = `
<alt-dropdown
	aria-label="Multiple channel options"
	data-dropdown-multiple
	data-dropdown-options
	footer-text="3 accounts available"
	multiple
	show-footer
></alt-dropdown>`;

const constrained = `
<alt-dropdown
	aria-label="Short channel list"
	data-dropdown-options
	empty-text="No channels"
	max-height="120"
></alt-dropdown>`;

const empty = `
<alt-dropdown
	aria-label="Empty options"
	data-custom-empty-icon
	empty-text="No connected accounts"
	footer-text="Connect an account to continue"
	show-footer
></alt-dropdown>`;

const overflow = `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-dropdown data-long-option footer-text="Footer metadata wraps without clipping" show-footer></alt-dropdown>
</div>`;

export const dropdownStory = defineStory({
	id: 'dropdown',
	title: 'Dropdown',
	group: 'Complex',
	summary: 'Reusable accessible listbox for single/multiple selection, empty states and optional footer.',
	examples: [
		example('Single selection', single, 'Arrow keys, Home/End and typeahead.'),
		example('Multiple with footer', multiple, 'Select-all action and selected options.'),
		example('Constrained height', constrained, 'Scrollable listbox with disabled option.'),
		example('Empty state', empty, 'Custom empty and footer copy.'),
		example('Long content and narrow container', overflow, 'Labels ellipsize and descriptions wrap.'),
	],
	setup: (root) => {
		for (const dropdown of findElements<AltDropdownElementApi>(root, '[data-dropdown-options]')) {
			dropdown.options = channelOptions;
		}
		for (const dropdown of findElements<AltDropdownElementApi>(root, '[data-dropdown-multiple]')) {
			dropdown.options = channelOptions.map((option) =>
				option.value === 'youtube' ? { ...option, checkIcon: createCustomIcon(document) } : option,
			);
			dropdown.values = ['youtube', 'instagram'];
		}
		for (const dropdown of findElements<AltDropdownElementApi>(root, '[data-custom-empty-icon]')) {
			dropdown.emptyIcon = createCustomIcon(document);
		}
		for (const dropdown of findElements<AltDropdownElementApi>(root, '[data-long-option]')) {
			dropdown.options = [longOption];
		}
	},
});
