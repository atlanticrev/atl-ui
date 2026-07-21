import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltAvatarElementClass } from '../../src/components/avatar';
import type { AltAvatarElementApi } from '../../src/components/avatar/types';

const TAG_NAME = 'alt-avatar-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) {
		customElements.define(TAG_NAME, createAltAvatarElementClass(window.HTMLElement));
	}
});

beforeEach(() => {
	document.body.replaceChildren();
});

describe('alt-avatar', () => {
	it('renders normalized initials and falls back after an image error', async () => {
		const avatar = document.createElement(TAG_NAME) as AltAvatarElementApi;
		const onError = vi.fn();
		avatar.initials = 'Max Tarasyuk';
		avatar.src = '/missing-avatar.png';
		avatar.addEventListener('alt-error', onError);
		document.body.append(avatar);
		await Promise.resolve();
		const image = avatar.querySelector<HTMLImageElement>('.alt-avatar__image');
		expect(image?.hidden).toBe(false);
		image?.dispatchEvent(new Event('error'));
		await Promise.resolve();

		expect(image?.hidden).toBe(true);
		expect(avatar.querySelector('.alt-avatar__initials')?.textContent).toBe('MT');
		expect(onError).toHaveBeenCalledOnce();
	});

	it('accepts a Node icon property without cloning it', async () => {
		const avatar = document.createElement(TAG_NAME) as AltAvatarElementApi;
		const icon = document.createElement('span');
		icon.textContent = 'A';
		avatar.icon = icon;
		document.body.append(avatar);
		await Promise.resolve();

		expect(avatar.querySelector('.alt-avatar__icon')?.firstChild).toBe(icon);
	});
});
