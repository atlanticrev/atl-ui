import { expect, type Page, test } from '@playwright/test';

const STORY_IDS = [
	'button',
	'card',
	'breadcrumbs',
	'checkbox',
	'radio',
	'switcher',
	'chip',
	'skeleton',
	'sidebar',
	'tabs',
	'tooltip',
	'popup',
	'dialog',
	'input',
	'select',
	'autocomplete',
	'dropdown',
	'avatar',
	'file-upload',
	'progress',
	'table',
	'toast',
] as const;

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);
	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

test('all stories stay inside the mobile viewport', async ({ page }) => {
	await page.setViewportSize({ height: 844, width: 390 });
	for (const storyId of STORY_IDS) {
		await openStory(page, storyId);
		const width = await page.evaluate(() => ({
			document: document.documentElement.scrollWidth,
			viewport: document.documentElement.clientWidth,
		}));
		expect(width.document, `${storyId} widened the page`).toBeLessThanOrEqual(width.viewport);
	}
});

test('mobile catalog search remains usable', async ({ page }) => {
	await page.setViewportSize({ height: 800, width: 320 });
	await openStory(page, 'table');
	const search = page.locator('.alt-catalog-search input');
	await expect(search).toBeVisible();
	const box = await search.boundingBox();
	expect(box?.width).toBeGreaterThan(120);
});

test('table scrolls instead of overlapping adjacent cells', async ({ page }) => {
	await page.setViewportSize({ height: 844, width: 390 });
	await openStory(page, 'table');
	const example = page.locator('[data-story-example="Custom render and pagination"]');
	const statusCell = example.locator('tbody tr').first().locator('td').nth(1);
	const audienceCell = example.locator('tbody tr').first().locator('td').nth(2);
	const statusBox = await statusCell.boundingBox();
	const audienceBox = await audienceCell.boundingBox();
	expect(statusBox?.x).toBeLessThan(audienceBox?.x ?? 0);
	expect((statusBox?.x ?? 0) + (statusBox?.width ?? 0)).toBeLessThanOrEqual(audienceBox?.x ?? 0);
	const scroll = example.locator('.alt-simple-table__scroll');
	const sizes = await scroll.evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));
	expect(sizes.scrollWidth).toBeGreaterThan(sizes.clientWidth);
	await expect(example).toHaveScreenshot('table-mobile.png');
});

test('long labels follow their component overflow contracts', async ({ page }) => {
	await page.setViewportSize({ height: 900, width: 390 });
	await openStory(page, 'chip');
	const chipExample = page.locator('[data-story-example="Long removable label"]');
	const label = chipExample.locator('.alt-chip__label');
	const labelSizes = await label.evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));
	expect(labelSizes.scrollWidth).toBeGreaterThan(labelSizes.clientWidth);
	await expect(chipExample.locator('.alt-chip__remove')).toBeVisible();
	await expect(chipExample).toHaveScreenshot('chip-long-label.png');
});

test('long selected filename ellipsizes without widening its frame', async ({ page }) => {
	await page.setViewportSize({ height: 900, width: 390 });
	await openStory(page, 'file-upload');
	const example = page.locator('#file-upload [data-story-example="Long content and narrow container"]');
	await example.locator('input[type="file"]').setInputFiles({
		buffer: Buffer.from('test'),
		mimeType: 'video/mp4',
		name: 'a-very-long-unbroken-social-video-filename-for-every-channel.mp4',
	});
	const value = example.locator('.alt-file-upload__value');
	const sizes = await value.evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));
	expect(sizes.scrollWidth).toBeGreaterThan(sizes.clientWidth);
	const frameSizes = await example.locator('.alt-catalog-stress-frame').evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));
	expect(frameSizes.scrollWidth).toBeLessThanOrEqual(frameSizes.clientWidth);
});
