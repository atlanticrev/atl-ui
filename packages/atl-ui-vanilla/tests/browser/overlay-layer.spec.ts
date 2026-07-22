import { expect, type Locator, type Page, test } from '@playwright/test';

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);

	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

const expectTopLayerEscape = async (frame: Locator, overlay: Locator): Promise<void> => {
	await expect(overlay).toBeVisible();

	expect(await overlay.evaluate((element) => element.matches(':popover-open'))).toBe(true);

	const frameBox = await frame.boundingBox();

	const overlayBox = await overlay.boundingBox();

	const escapesFrame =
		(overlayBox?.x ?? 0) < (frameBox?.x ?? 0) ||
		(overlayBox?.y ?? 0) < (frameBox?.y ?? 0) ||
		(overlayBox?.x ?? 0) + (overlayBox?.width ?? 0) > (frameBox?.x ?? 0) + (frameBox?.width ?? 0) ||
		(overlayBox?.y ?? 0) + (overlayBox?.height ?? 0) > (frameBox?.y ?? 0) + (frameBox?.height ?? 0);

	expect(escapesFrame).toBe(true);
};

test('all anchored overlay components escape clipping containers through the shared top layer', async ({ page }) => {
	await openStory(page, 'popup');

	let frame = page.locator('#popup [data-story-example="Clipping container"] [data-overlay-clip]');

	await frame.getByRole('button', { name: 'Open clipped popup' }).click();

	await expectTopLayerEscape(frame, frame.locator('alt-popup'));

	await openStory(page, 'menu');

	frame = page.locator('#menu [data-story-example="Clipping container"] [data-overlay-clip]');

	await frame.getByRole('button', { name: 'Clipped menu' }).click();

	await expectTopLayerEscape(frame, frame.getByRole('menu'));

	await openStory(page, 'tooltip');

	frame = page.locator('#tooltip [data-story-example="Truncated text"] [data-overlay-clip]');

	await frame.locator('[data-alt-overflow-target]').focus();

	const tooltip = frame.getByRole('tooltip');

	await expectTopLayerEscape(frame, tooltip);

	expect(await tooltip.getAttribute('data-placement')).toMatch(/^(bottom|left|right|top)$/);

	expect(await tooltip.evaluate((element) => getComputedStyle(element, '::before').content)).not.toBe('none');

	await openStory(page, 'select');

	frame = page.locator('#select [data-story-example="Long content and narrow container"] [data-overlay-clip]');

	await frame.getByRole('combobox').click();

	await expectTopLayerEscape(frame, frame.locator('.alt-select__popup'));

	await openStory(page, 'autocomplete');

	frame = page.locator('#autocomplete [data-story-example="Long content and narrow container"] [data-overlay-clip]');

	await frame.getByRole('combobox').focus();

	await expectTopLayerEscape(frame, frame.locator('alt-popup'));
});

test('an anchored overlay opened from a modal dialog remains above the dialog', async ({ page }) => {
	await openStory(page, 'dialog');

	const example = page.locator('#dialog [data-story-example="Nested overlay"]');

	await example.getByRole('button', { name: 'Open overlay dialog' }).click();

	const dialog = page.getByRole('dialog', { name: 'Overlay inside dialog' });

	await dialog.getByRole('combobox', { name: 'Channel' }).click();

	const popup = dialog.locator('.alt-select__popup');

	await expect(popup).toBeVisible();

	expect(await popup.evaluate((element) => element.matches(':popover-open'))).toBe(true);

	const optionReceivesPointer = await popup.locator('[data-value="youtube"]').evaluate((element) => {
		const bounds = element.getBoundingClientRect();

		const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);

		return hit === element || element.contains(hit);
	});

	expect(optionReceivesPointer).toBe(true);
});
