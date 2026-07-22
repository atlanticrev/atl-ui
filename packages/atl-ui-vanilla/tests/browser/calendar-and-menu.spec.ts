import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('date picker commits a day and restores trigger focus', async ({ page }) => {
	await page.goto('/storybook.html#date-picker');

	const example = page.locator('#date-picker [data-story-example="Single date"]');

	const picker = example.locator('alt-date-picker');

	const trigger = picker.locator('.alt-date-picker__trigger');

	await expect(picker.locator('.alt-date-picker__clear [data-alt-icon="close"]')).toBeVisible();

	await trigger.click();

	await expect(picker.locator('.alt-date-picker__panel')).toBeVisible();

	await expect(picker.locator('[data-value="2026-07-22"]')).toBeFocused();

	await picker.locator('[data-value="2026-07-23"]').click();

	await expect(picker).toHaveAttribute('value', '2026-07-23');

	await expect(picker.locator('.alt-date-picker__panel')).toBeHidden();

	await expect(trigger).toBeFocused();
});

test('date picker panel escapes clipping containers through the top layer', async ({ page }) => {
	await page.goto('/storybook.html#date-picker');

	const example = page.locator('#date-picker [data-story-example="Clipping container"]');

	const picker = example.locator('alt-date-picker');

	await picker.locator('.alt-date-picker__trigger').click();

	const panel = picker.locator('.alt-date-picker__panel');

	await expect(panel).toBeVisible();

	expect(await panel.evaluate((element) => element.matches(':popover-open'))).toBe(true);

	const panelBox = await panel.boundingBox();

	const exampleBox = await example.boundingBox();

	const escapesExampleBounds =
		(panelBox?.x ?? 0) < (exampleBox?.x ?? 0) ||
		(panelBox?.y ?? 0) < (exampleBox?.y ?? 0) ||
		(panelBox?.x ?? 0) + (panelBox?.width ?? 0) > (exampleBox?.x ?? 0) + (exampleBox?.width ?? 0) ||
		(panelBox?.y ?? 0) + (panelBox?.height ?? 0) > (exampleBox?.y ?? 0) + (exampleBox?.height ?? 0);

	expect(escapesExampleBounds).toBe(true);

	const lowerDayReceivesPointer = await picker.locator('[data-value="2026-07-29"]').evaluate((element) => {
		const bounds = element.getBoundingClientRect();

		const hit = document.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);

		return hit === element || element.contains(hit);
	});

	expect(lowerDayReceivesPointer).toBe(true);
});

test('calendar keyboard navigation crosses a month boundary', async ({ page }) => {
	await page.goto('/storybook.html#calendar');

	const calendar = page.locator('#calendar [data-story-example="Single date"] alt-calendar');

	const previous = calendar.locator('[data-action="previous"]');

	const next = calendar.locator('[data-action="next"]');

	await expect(previous.locator('[data-alt-icon="chevron-left"]')).toBeVisible();

	await expect(next.locator('[data-alt-icon="chevron-right"]')).toBeVisible();

	const navigationGeometry = await previous.evaluate((element) => {
		const button = element.getBoundingClientRect();

		const icon = element.querySelector('svg')?.getBoundingClientRect();

		return {
			x: icon ? icon.left + icon.width / 2 - (button.left + button.width / 2) : 1,
			y: icon ? icon.top + icon.height / 2 - (button.top + button.height / 2) : 1,
		};
	});

	expect(Math.abs(navigationGeometry.x)).toBeLessThanOrEqual(0.5);

	expect(Math.abs(navigationGeometry.y)).toBeLessThanOrEqual(0.5);

	const selected = calendar.locator('[data-value="2026-07-22"]');

	await selected.focus();

	await page.keyboard.press('End');

	await expect(calendar.locator('[data-value="2026-07-26"]')).toBeFocused();

	await page.keyboard.press('PageDown');

	await expect(calendar.locator('[data-value="2026-08-26"]')).toBeFocused();
});

test('day, month and year calendar views use the same width', async ({ page }) => {
	await page.goto('/storybook.html#calendar');

	const single = page.locator('#calendar [data-story-example="Single date"] alt-calendar');

	const months = page.locator(
		'#calendar [data-story-example="Month and year selection"] alt-calendar[view="months"]',
	);

	const years = page.locator('#calendar [data-story-example="Month and year selection"] alt-calendar[view="years"]');

	const widths = await Promise.all(
		[single, months, years].map(async (calendar) => (await calendar.boundingBox())?.width),
	);

	expect(widths).toEqual([328, 328, 328]);
});

test('calendar presets reuse actionable chip recipes', async ({ page }) => {
	await page.goto('/storybook.html#calendar');

	const calendar = page.locator('#calendar [data-story-example="Date range and presets"] alt-calendar');

	const preset = calendar.locator('button.alt-chip[data-preset="0"]');

	await expect(preset.locator('.alt-chip__label')).toHaveText('Last 7 days');

	await preset.click();

	await expect(calendar).toHaveAttribute('start', '2026-07-16');

	await expect(calendar).toHaveAttribute('end', '2026-07-22');
});

test('menu is fully operable from the keyboard', async ({ page }) => {
	await page.goto('/storybook.html#menu');

	const menu = page.locator('#menu [data-story-example="Actions"] alt-menu');

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

	await page.locator('#menu [data-story-example="Actions"] [data-alt-menu-trigger]').click();

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
