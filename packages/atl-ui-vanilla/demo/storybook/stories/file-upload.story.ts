import type { AltFileUploadElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

export const fileUploadStory = defineStory({
	id: 'file-upload',
	title: 'File upload',
	group: 'Complex',
	summary: 'Native file input with styled action, form name, accept filters, multiple mode and status.',
	examples: [
		example(
			'Default and filters',
			`
<div class="alt-catalog-story-stack">
	<alt-file-upload helper-text="Any file up to the app limit" label="Choose file" name="asset"></alt-file-upload>
	<alt-file-upload accept="image/png,image/jpeg" helper-text="PNG or JPEG" label="Choose image"></alt-file-upload>
	<alt-file-upload accept="video/*" helper-text="All selected videos" label="Choose videos" multiple></alt-file-upload>
	<alt-file-upload data-custom-icon helper-text="Any consumer SVG" label="Custom icon"></alt-file-upload>
</div>`,
			undefined,
			true,
		),
		example(
			'Statuses',
			`
<div class="alt-catalog-story-stack">
	<alt-file-upload helper-text="Waiting for a file" label="Default"></alt-file-upload>
	<alt-file-upload helper-text="Unsupported file" label="Error" status="error"></alt-file-upload>
	<alt-file-upload helper-text="Ready to upload" label="Success" status="success"></alt-file-upload>
	<alt-file-upload disabled helper-text="Upload unavailable" label="Disabled"></alt-file-upload>
	</div>`,
			undefined,
			true,
		),
		example(
			'Long content and narrow container',
			`<div class="alt-catalog-stress-frame" data-width="narrow">
	<alt-file-upload
		helper-text="Long URLs and validation details wrap: https://example.com/a/very/long/path/without/spaces"
		label="Choose a very long media filename"
	></alt-file-upload>
</div>`,
			'Filename ellipsis and fully readable helper copy.',
		),
	],
	setup: (root) => {
		findElement<AltFileUploadElementApi>(root, '[data-custom-icon]').buttonIcon = createCustomIcon(document);
	},
});
