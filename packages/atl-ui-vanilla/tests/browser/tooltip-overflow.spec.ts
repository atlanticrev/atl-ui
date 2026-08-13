import { expect, test } from '@playwright/test';

test('overflow-only tooltip follows real rendered truncation', async ({ page }) => {
	await page.setViewportSize({ height: 800, width: 390 });

	await page.goto('/storybook.html#tooltip');

	const example = page.locator('#tooltip [data-story-example="Truncated text"]');

	const target = example.locator('[data-alt-overflow-target]');

	const panel = example.locator('[role="tooltip"]');

	await target.focus();

	await expect(panel).toBeVisible();

	await target.blur();

	await expect(panel).toBeHidden();

	await target.evaluate((element) => {
		element.textContent = 'Short value';
	});

	await target.focus();

	await expect(panel).toBeHidden();
});

test('long tooltip text wraps and never retains the native title attribute', async ({ page }) => {
	await page.setViewportSize({ height: 800, width: 390 });

	await page.goto('/storybook.html#tooltip');

	const example = page.locator('#tooltip [data-story-example="Long wrapped content"]');

	const host = example.locator('alt-tooltip');

	await expect(host).not.toHaveAttribute('title', /.+/);

	await example.getByRole('button', { name: 'Long explanation' }).focus();

	const panel = example.getByRole('tooltip');

	await expect(panel).toBeVisible();

	const geometry = await panel.evaluate((element) => ({
		clientWidth: element.clientWidth,
		height: element.getBoundingClientRect().height,
		scrollWidth: element.scrollWidth,
		whiteSpace: getComputedStyle(element).whiteSpace,
		width: element.getBoundingClientRect().width,
	}));

	expect(geometry.whiteSpace).toBe('normal');

	expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);

	expect(geometry.width).toBeLessThanOrEqual(240);

	expect(geometry.height).toBeGreaterThan(40);
});
