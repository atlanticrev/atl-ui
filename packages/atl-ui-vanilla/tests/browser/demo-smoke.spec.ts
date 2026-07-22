import { expect, test } from '@playwright/test';

test('root demo upgrades declarative selects without blocking initialization', async ({ page }) => {
	const pageErrors: string[] = [];

	page.on('pageerror', (error) => pageErrors.push(error.message));

	await page.goto('/');

	await expect(page.locator('html')).toHaveAttribute('data-demo-ready', 'true');

	const select = page.locator('alt-select').first();

	await expect(select.locator('.alt-listbox__option')).toHaveCount(3);

	await expect(select.locator('.alt-listbox__option-label')).toHaveText(['YouTube', 'TikTok', 'Instagram']);

	await select.getByRole('combobox').click();

	await select.locator('[role="option"][data-value="tiktok"]').click();

	await expect(select.locator('.alt-select__value')).toHaveText('TikTok');

	await expect.poll(() => select.evaluate((element) => Reflect.get(element, 'value'))).toBe('tiktok');

	expect(pageErrors).toEqual([]);
});
