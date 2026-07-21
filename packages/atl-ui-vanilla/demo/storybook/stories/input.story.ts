import { createAltIcon, type AltInputElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElements } from '../dom';
import { example, defineStory } from '../story-factory';

const sizes = `
<div class="alt-catalog-story-stack">
	<alt-input label="Extra large" size="xl" value="XL input"></alt-input>
	<alt-input label="Large" size="l" value="Large input"></alt-input>
	<alt-input label="Medium" size="m" value="Medium input"></alt-input>
	<alt-input label="Small" size="s" value="Small input"></alt-input>
	<alt-input label="Extra small" size="xs" value="XS input"></alt-input>
</div>`;

const states = `
<div class="alt-catalog-story-stack">
	<alt-input helper-text="Helpful context" label="Default" placeholder="Type something"></alt-input>
	<alt-input helper-text="This field is required" label="Error" status="error"></alt-input>
	<alt-input helper-text="Looks good" label="Success" status="success" value="Valid value"></alt-input>
	<alt-input disabled label="Disabled" value="Cannot edit"></alt-input>
	<alt-input label="Read only" readonly value="Readable value"></alt-input>
	<alt-input label="Styled read only" read-only-styled value="Muted value"></alt-input>
</div>`;

const features = `
<div class="alt-catalog-story-stack">
	<alt-input data-leading label="Search" placeholder="Search posts"></alt-input>
	<alt-input data-trailing label="Password" type="password" value="secret"></alt-input>
	<alt-input label="Budget" min="0" step="10" variant="number" value="120"></alt-input>
	<alt-input label="Caption" max-length="40" show-character-count value="Short launch caption"></alt-input>
</div>`;

const surfaces = `
<div class="alt-catalog-story-stack">
	<alt-input
		label="Tinted surface"
		placeholder="No painted label background"
		style="--alt-input-bg: var(--alt-color-accent-muted)"
	></alt-input>
	<alt-input disabled label="Disabled surface" placeholder="Still a real SVG notch"></alt-input>
</div>`;

export const inputStory = defineStory({
	id: 'input',
	title: 'Input',
	group: 'Complex',
	summary: 'Form-associated native input with owned decoration, sizes, status, icons and validation.',
	examples: [
		example('Sizes', sizes, 'All five public control sizes.', true),
		example('States', states, 'Default, semantic, disabled and readonly states.', true),
		example('Features', features, 'Icons, number variant and character counter.', true),
		example('Custom surfaces', surfaces, 'SVG notches stay correct on any field background.', true),
		example(
			'Long content and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-input
		helper-text="Validation details wrap even for https://example.com/a/very/long/path/without/spaces"
		label="Extremely long floating field label"
		value="A-very-long-input-value-that-remains-editable"
	></alt-input>
</div>`,
			'Label ellipsis, editable value scrolling and wrapped helper text.',
		),
	],
	setup: (root) => {
		for (const input of findElements<AltInputElementApi>(root, '[data-leading]')) {
			input.leadingIcon = createCustomIcon(document);
		}
		for (const input of findElements<AltInputElementApi>(root, '[data-trailing]')) {
			input.trailingIcon = createAltIcon(document, 'eye');
		}
	},
});
