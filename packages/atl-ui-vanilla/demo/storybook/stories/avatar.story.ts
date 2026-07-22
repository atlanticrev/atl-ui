import type { AltAvatarElementApi } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement } from '../dom';
import { example, defineStory } from '../story-factory';

const sizes = `
<div class="alt-catalog-story-row">
	<alt-avatar initials="Max Tarasyuk" size="24"></alt-avatar>
	<alt-avatar initials="Max Tarasyuk" size="32"></alt-avatar>
	<alt-avatar initials="Max Tarasyuk" size="48"></alt-avatar>
	<alt-avatar initials="Max Tarasyuk" size="64"></alt-avatar>
</div>`;

const content = `
<div class="alt-catalog-story-row">
	<alt-avatar alt="Illustrated profile" data-avatar-image size="48"></alt-avatar>
	<alt-avatar initials="Atlantic Review" size="48"></alt-avatar>
	<alt-avatar data-avatar-icon size="48"></alt-avatar>
	<alt-avatar initials="Fallback User" src="/missing-avatar.png" size="48"></alt-avatar>
</div>`;

const shapes = `
<div class="alt-catalog-story-row">
	<alt-avatar initials="Circle Avatar" shape="circle" size="48"></alt-avatar>
	<alt-avatar initials="Square Avatar" shape="square" size="48"></alt-avatar>
</div>`;

const createAvatarSource = (): string => {
	const svg =
		'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">' +
		'<rect width="64" height="64" fill="#d8e5ff"/><circle cx="32" cy="25" r="13" fill="#315ea8"/>' +
		'<path d="M10 64c3-17 13-25 22-25s19 8 22 25" fill="#315ea8"/></svg>';

	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const avatarStory = defineStory({
	id: 'avatar',
	title: 'Avatar',
	group: 'Complex',
	summary: 'Owned image rendering with initials, icon and error fallback across supported sizes and shapes.',
	examples: [
		example('Sizes', sizes, '24, 32, 48 and 64 px.'),
		example('Content fallbacks', content, 'Image, initials, icon and failed-image fallback.', true),
		example('Shapes', shapes, 'Circle and square.'),
		example(
			'Long fallback name',
			'<alt-avatar initials="An extremely long international profile name" size="48"></alt-avatar>',
			'Initial extraction keeps the fixed avatar geometry.',
		),
	],
	setup: (root) => {
		findElement<AltAvatarElementApi>(root, '[data-avatar-image]').src = createAvatarSource();

		findElement<AltAvatarElementApi>(root, '[data-avatar-icon]').icon = createCustomIcon(document);
	},
});
