import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createAltMenuElementClass } from '../../src/components/menu';

const TAG_NAME = 'alt-menu-test';

beforeAll(() => {
	if (!customElements.get(TAG_NAME)) customElements.define(TAG_NAME, createAltMenuElementClass(window.HTMLElement));
});

beforeEach(() => document.body.replaceChildren());

const render = async (): Promise<HTMLElement> => {
	document.body.innerHTML = `<${TAG_NAME}><button data-alt-menu-trigger>Actions</button><div role="menu"><button data-value="edit" role="menuitem">Edit</button><button disabled role="menuitem">Disabled</button><button data-value="delete" role="menuitem">Delete</button></div></${TAG_NAME}>`;

	await Promise.resolve();

	return document.querySelector(TAG_NAME) as HTMLElement;
};

describe('alt-menu', () => {
	it('opens from the trigger and supports arrow navigation', async () => {
		const menu = await render();

		const trigger = menu.querySelector('[data-alt-menu-trigger]') as HTMLButtonElement;

		trigger.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));

		await Promise.resolve();

		expect(menu.hasAttribute('open')).toBe(true);

		expect(document.activeElement?.textContent).toBe('Edit');

		document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' }));

		expect(document.activeElement?.textContent).toBe('Delete');
	});

	it('emits selection and restores focus', async () => {
		const menu = await render();

		const selected = vi.fn();

		menu.addEventListener('alt-select', selected);

		(menu.querySelector('[data-alt-menu-trigger]') as HTMLButtonElement).click();

		await Promise.resolve();

		(menu.querySelector('[data-value="edit"]') as HTMLButtonElement).click();

		expect(selected.mock.calls[0][0].detail.value).toBe('edit');

		expect(menu.hasAttribute('open')).toBe(false);

		expect(document.activeElement).toBe(menu.querySelector('[data-alt-menu-trigger]'));
	});

	it('closes on Escape', async () => {
		const menu = await render();

		(menu.querySelector('[data-alt-menu-trigger]') as HTMLButtonElement).click();

		await Promise.resolve();

		(document.activeElement as HTMLElement).dispatchEvent(
			new KeyboardEvent('keydown', { bubbles: true, key: 'Escape' }),
		);

		expect(menu.hasAttribute('open')).toBe(false);
	});
});
