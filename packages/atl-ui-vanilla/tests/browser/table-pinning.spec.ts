import { expect, test } from '@playwright/test';

test('multiple fixed columns stay pinned to both sides of the table scroll region', async ({ page }) => {
	await page.setViewportSize({ height: 900, width: 1000 });

	await page.goto('/storybook.html#table');

	const example = page.locator('[data-story-example="Pinned columns"]');

	await expect(example).toBeVisible();

	const scroll = example.locator('.alt-simple-table__scroll');

	const headers = example.locator('th');

	const first = headers.nth(0);

	const second = headers.nth(1);

	const last = headers.nth(3);

	const sizes = await scroll.evaluate((element) => ({
		clientWidth: element.clientWidth,
		scrollWidth: element.scrollWidth,
	}));

	expect(sizes.scrollWidth).toBeGreaterThan(sizes.clientWidth);

	await expect(first).toHaveCSS('position', 'sticky');

	await expect(second).toHaveCSS('position', 'sticky');

	await expect(last).toHaveCSS('position', 'sticky');

	const before = await Promise.all([first.boundingBox(), second.boundingBox(), last.boundingBox()]);

	await scroll.evaluate((element) => {
		element.scrollLeft = element.scrollWidth;
	});

	const after = await Promise.all([first.boundingBox(), second.boundingBox(), last.boundingBox()]);

	expect(Math.abs((after[0]?.x ?? 0) - (before[0]?.x ?? 0))).toBeLessThanOrEqual(1);

	expect(Math.abs((after[1]?.x ?? 0) - (before[1]?.x ?? 0))).toBeLessThanOrEqual(1);

	expect(Math.abs((after[2]?.x ?? 0) - (before[2]?.x ?? 0))).toBeLessThanOrEqual(1);

	const leftGap = (after[1]?.x ?? 0) - (after[0]?.x ?? 0) - (after[0]?.width ?? 0);

	const scrollBox = await scroll.boundingBox();

	const rightGap = (after[2]?.x ?? 0) + (after[2]?.width ?? 0) - (scrollBox?.x ?? 0) - (scrollBox?.width ?? 0);

	expect(Math.abs(leftGap)).toBeLessThanOrEqual(1);

	expect(Math.abs(rightGap)).toBeLessThanOrEqual(1);
});
