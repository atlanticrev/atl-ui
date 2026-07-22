import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('date picker commits a day and restores trigger focus', async ({ page }) => {
	await page.goto('/storybook.html#date-picker');

	const example = page.locator('#date-picker [data-story-example="Single date"]');

	const picker = example.locator('alt-date-picker');

	const trigger = picker.locator('.alt-date-picker__trigger');

	await trigger.click();

	await expect(picker.locator('.alt-date-picker__panel')).toBeVisible();

	await expect(picker.locator('[data-value="2026-07-22"]')).toBeFocused();

	await picker.locator('[data-value="2026-07-23"]').click();

	await expect(picker).toHaveAttribute('value', '2026-07-23');

	await expect(picker.locator('.alt-date-picker__panel')).toBeHidden();

	await expect(trigger).toBeFocused();
});

test('calendar keyboard navigation crosses a month boundary', async ({ page }) => {
	await page.goto('/storybook.html#calendar');

	const calendar = page.locator('#calendar [data-story-example="Single date"] alt-calendar');

	const selected = calendar.locator('[data-value="2026-07-22"]');

	await selected.focus();

	await page.keyboard.press('End');

	await expect(calendar.locator('[data-value="2026-07-26"]')).toBeFocused();

	await page.keyboard.press('PageDown');

	await expect(calendar.locator('[data-value="2026-08-26"]')).toBeFocused();
});

test('menu is fully operable from the keyboard', async ({ page }) => {
	await page.goto('/storybook.html#menu');

	const menu = page.locator('#menu alt-menu');

	const trigger = menu.locator('[data-alt-menu-trigger]');

	await trigger.focus();

	await page.keyboard.press('ArrowDown');

	await expect(menu.getByRole('menu')).toBeVisible();

	await expect(menu.getByRole('menuitem', { name: 'Edit campaign' })).toBeFocused();

	await page.keyboard.press('End');

	await expect(menu.getByRole('menuitem', { name: 'Delete' })).toBeFocused();

	await page.keyboard.press('Escape');

	await expect(menu.getByRole('menu')).toBeHidden();

	await expect(trigger).toBeFocused();
});

test('open calendar and menu pass an accessibility audit', async ({ page }) => {
	await page.goto('/storybook.html#date-picker');

	await page.locator('#date-picker [data-story-example="Single date"] .alt-date-picker__trigger').click();

	const result = await new AxeBuilder({ page }).include('#date-picker').analyze();

	expect(result.violations.map(({ id }) => id)).toEqual([]);

	await page.goto('/storybook.html#menu');

	await page.locator('#menu [data-alt-menu-trigger]').click();

	const menuResult = await new AxeBuilder({ page }).include('#menu').analyze();

	expect(menuResult.violations.map(({ id }) => id)).toEqual([]);
});

test('range picker becomes a full-width bottom sheet on mobile', async ({ page }) => {
	await page.setViewportSize({ height: 740, width: 390 });

	await page.goto('/storybook.html#date-picker');

	const picker = page.locator('#date-picker [data-story-example="Date range"] alt-date-range-picker');

	await picker.locator('.alt-date-picker__trigger').click();

	const panel = picker.locator('.alt-date-picker__panel');

	const box = await panel.boundingBox();

	expect(box?.x).toBe(0);

	expect(box?.width).toBe(390);

	expect(Math.round((box?.y ?? 0) + (box?.height ?? 0))).toBe(740);
});
