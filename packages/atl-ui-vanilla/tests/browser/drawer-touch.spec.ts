import { expect, type Locator, test } from '@playwright/test';

type TouchType = 'touchend' | 'touchmove' | 'touchstart';

const dispatchTouch = async (surface: Locator, type: TouchType, x: number, y: number): Promise<boolean> => {
	return surface.evaluate(
		(element, touchInit) => {
			const touch = new Touch({
				clientX: touchInit.x,
				clientY: touchInit.y,
				identifier: 1,
				screenX: touchInit.x,
				screenY: touchInit.y,
				target: element,
			});

			const event = new TouchEvent(touchInit.type, {
				bubbles: true,
				cancelable: true,
				changedTouches: [touch],
				touches: touchInit.type === 'touchend' ? [] : [touch],
			});

			element.dispatchEvent(event);

			return event.defaultPrevented;
		},
		{ type, x, y },
	);
};

test.beforeEach(async ({ browserName, page }) => {
	test.skip(browserName !== 'chromium', 'Touch constructor coverage is Chromium-specific');

	const session = await page.context().newCDPSession(page);

	await session.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
});

test('left drawer follows a touch gesture and dismisses beyond halfway', async ({ page }) => {
	await page.setViewportSize({ height: 844, width: 390 });

	await page.goto('/storybook.html#drawer');

	await page.getByRole('button', { name: 'Open left drawer' }).click();

	const dialog = page.getByRole('dialog', { name: 'Menu' });

	await expect(dialog).toBeVisible();

	await page.waitForTimeout(50);

	await dispatchTouch(dialog, 'touchstart', 280, 400);

	await dispatchTouch(dialog, 'touchmove', 250, 400);

	await dispatchTouch(dialog, 'touchmove', 180, 402);

	const dragging = await dialog.evaluate((element) => ({
		backdropOpacity: getComputedStyle(element, '::backdrop').opacity,
		swiping: element.getAttribute('data-swiping'),
		transform: getComputedStyle(element).transform,
	}));

	expect(dragging.swiping).toBe('true');

	expect(dragging.transform).not.toBe('none');

	expect(Number(dragging.backdropOpacity)).toBeLessThan(1);

	await dispatchTouch(dialog, 'touchmove', 40, 404);

	await dispatchTouch(dialog, 'touchend', 40, 404);

	await expect(dialog).toBeHidden();
});

test('mobile date range sheet reuses swipe-to-dismiss behavior', async ({ page }) => {
	await page.setViewportSize({ height: 900, width: 900 });

	await page.goto('/storybook.html#date-picker');

	await page.setViewportSize({ height: 740, width: 390 });

	const picker = page.locator('#date-picker [data-story-example="Date range"] alt-date-range-picker');

	const trigger = picker.locator('.alt-date-picker__trigger');

	await trigger.click();

	const panel = picker.locator('.alt-date-picker__panel');

	await expect(panel).toBeVisible();

	expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

	const bounds = await panel.boundingBox();

	if (!bounds) throw new Error('Missing date range sheet bounds');

	const startY = bounds.y + 40;

	await dispatchTouch(panel, 'touchstart', 195, startY);

	await dispatchTouch(panel, 'touchmove', 195, startY + 24);

	await dispatchTouch(panel, 'touchmove', 195, startY + bounds.height * 0.7);

	await expect(panel).toHaveAttribute('data-swiping', 'true');

	await dispatchTouch(panel, 'touchend', 195, startY + bounds.height * 0.7);

	await expect(panel).toBeHidden();

	expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');

	await expect(trigger).toBeFocused();
});

test('bottom sheet captures the closing touch before Android can scroll the page underneath', async ({ page }) => {
	await page.setViewportSize({ height: 844, width: 390 });

	await page.goto('/storybook.html#drawer');

	await page.getByRole('button', { name: 'Open bottom sheet' }).click();

	const dialog = page.getByRole('dialog', { name: 'Schedule publication' });

	const body = dialog.locator('.alt-drawer__body');

	await expect(dialog).toBeVisible();

	expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden');

	await dispatchTouch(body, 'touchstart', 195, 400);

	const capturedBeforeActivation = await dispatchTouch(body, 'touchmove', 195, 404);

	expect(capturedBeforeActivation).toBe(true);

	await expect(dialog).not.toHaveAttribute('data-swiping', 'true');

	await dispatchTouch(body, 'touchmove', 195, 430);

	await expect(dialog).toHaveAttribute('data-swiping', 'true');

	await dispatchTouch(body, 'touchend', 195, 430);

	await expect(dialog).not.toHaveAttribute('data-swiping', 'true');

	await expect.poll(async () => dialog.evaluate((element) => element.style.transform)).toBe('');

	await dialog.evaluate((element) => {
		(element.parentElement as HTMLElement & { close: () => void }).close();
	});

	await expect(dialog).toBeHidden();

	expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('');
});
