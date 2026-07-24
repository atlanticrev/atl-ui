import { defineStory, example } from '../story-factory';

const basic = `
<div class="alt-catalog-story-stack">
	<alt-textarea
		helper-text="Add the text that should accompany the published media."
		label="Caption"
		name="caption"
		placeholder="Write a caption"
		rows="5"
	></alt-textarea>
</div>`;

const states = `
<div class="alt-catalog-story-stack">
	<alt-textarea helper-text="Optional supporting text" label="Default" value="Editable value"></alt-textarea>
	<alt-textarea helper-text="A caption is required" label="Error" status="error"></alt-textarea>
	<alt-textarea helper-text="Ready to publish" label="Success" status="success" value="Approved"></alt-textarea>
	<alt-textarea disabled label="Disabled" value="Cannot edit"></alt-textarea>
	<alt-textarea label="Read only" readonly value="Readable value"></alt-textarea>
	<alt-textarea label="Styled read only" read-only-styled value="Muted value"></alt-textarea>
</div>`;

const features = `
<div class="alt-catalog-story-stack">
	<alt-textarea
		label="Limited caption"
		max-length="120"
		show-character-count
		value="Short launch caption"
	></alt-textarea>
	<alt-textarea
		description="The description remains inside the outlined control."
		label="Description"
		rows="4"
	></alt-textarea>
</div>`;

export const textareaStory = defineStory({
	id: 'textarea',
	title: 'Textarea',
	group: 'Complex',
	summary: 'Native multiline field with a static notched label, form integration, states and validation.',
	examples: [
		example('Basic', basic, 'The label always remains in the real SVG notch.', true),
		example('States', states, 'Default, semantic, disabled and readonly states.', true),
		example('Features', features, 'Optional character counter and supporting description.', true),
		example(
			'Long content and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-textarea
		helper-text="Validation details wrap even for https://example.com/a/very/long/path/without/spaces"
		label="Extremely long static field label"
		rows="5"
		value="A long multiline value remains editable and the field grows only when the user resizes it."
	></alt-textarea>
</div>`,
			'Label ellipsis, editable text scrolling and wrapped helper text.',
		),
	],
});
