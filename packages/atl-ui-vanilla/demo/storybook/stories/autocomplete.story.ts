import type { AltAutocompleteElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElements } from '../dom';
import { longOption, toolOptions } from '../fixtures';
import { example, defineStory } from '../story-factory';

const modes = `
<div class="alt-catalog-story-stack">
	<alt-autocomplete data-tool-options label="Single" placeholder="Choose a tool"></alt-autocomplete>
	<alt-autocomplete data-tool-options free-solo label="Free solo" placeholder="Type or choose"></alt-autocomplete>
	<alt-autocomplete data-multiple data-tool-options label="Multiple" multiple></alt-autocomplete>
</div>`;

const states = `
<div class="alt-catalog-story-stack">
	<alt-autocomplete data-tool-options helper-text="Start typing" label="Default"></alt-autocomplete>
	<alt-autocomplete data-tool-options label="Loading" loading loading-text="Loading tools…"></alt-autocomplete>
	<alt-autocomplete data-tool-options disabled label="Disabled" value="figma"></alt-autocomplete>
	<alt-autocomplete data-tool-options label="Read only" readonly value="linear"></alt-autocomplete>
	<alt-autocomplete data-tool-options label="Error" status="error" helper-text="Choose a tool"></alt-autocomplete>
</div>`;

const custom = `
<div class="alt-catalog-story-stack">
<alt-autocomplete data-tool-options label="Custom composition" value="figma">
	<input class="alt-autocomplete__input" data-alt-autocomplete-input type="search" />
	<button class="alt-button" data-alt-autocomplete-trigger data-variant="outlined" type="button">
		Browse
	</button>
	<button class="alt-button" data-alt-autocomplete-clear data-variant="text" type="button">
		Clear
	</button>
</alt-autocomplete>
<alt-autocomplete data-custom-icons data-tool-options label="Replaceable icons" value="linear"></alt-autocomplete>
</div>`;

const behavior = `
<div class="alt-catalog-story-stack">
	<alt-autocomplete
		clear-on-blur="false"
		clear-on-escape
		data-tool-options
		label="Persistent query"
		open-on-focus="false"
		search-placeholder="Filter tools…"
	></alt-autocomplete>
	<alt-autocomplete
		data-tool-options
		flip="false"
		label="Fixed placement"
		max-dropdown-height="140"
		no-results-text="Nothing matched"
	></alt-autocomplete>
</div>`;

const overflow = `
<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-autocomplete data-long-option label="Long selected value" value="long-option"></alt-autocomplete>
</div>`;

export const autocompleteStory = defineStory({
	id: 'autocomplete',
	title: 'Autocomplete',
	group: 'Complex',
	summary: 'Searchable selection with single, multiple, free-solo and fully authored input/actions.',
	examples: [
		example('Selection modes', modes, 'Single, free-solo and multiple.', true),
		example('States', states, 'Loading, disabled, readonly and error.', true),
		example('Custom composition', custom, 'Authored native input and arbitrary buttons.', true),
		example('Behavior options', behavior, 'Blur, Escape, focus, positioning and empty text.', true),
		example('Long content and narrow container', overflow, 'Selected labels stay inside the field.'),
	],
	setup: (root) => {
		for (const autocomplete of findElements<AltAutocompleteElementApi>(root, '[data-tool-options]')) {
			autocomplete.options = toolOptions;
		}

		for (const autocomplete of findElements<AltAutocompleteElementApi>(root, '[data-multiple]')) {
			autocomplete.values = ['figma', 'notion'];
		}

		for (const autocomplete of findElements<AltAutocompleteElementApi>(root, '[data-custom-icons]')) {
			autocomplete.clearIcon = createCustomIcon(document);

			autocomplete.indicatorIcon = createCustomIcon(document);

			autocomplete.noResultsIcon = createCustomIcon(document);
		}

		for (const autocomplete of findElements<AltAutocompleteElementApi>(root, '[data-long-option]')) {
			autocomplete.options = [longOption];
		}
	},
});
