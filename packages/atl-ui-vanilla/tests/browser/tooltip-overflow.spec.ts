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
