import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const openDrawerStory = async (page: import('@playwright/test').Page): Promise<void> => {
	await page.setViewportSize({ height: 844, width: 390 });

	await page.goto('/storybook.html#drawer');

	await expect(page.locator('#drawer')).toBeVisible();
};

test.describe('motion', () => {
	test('left drawer visibly travels from outside the desktop viewport when it opens', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'no-preference' });

		await page.setViewportSize({ height: 800, width: 1280 });

		await page.goto('/storybook.html#drawer');

		const trigger = page.getByRole('button', { name: 'Open left drawer' });

		const positions = await trigger.evaluate((button) => {
			return new Promise<number[]>((resolve) => {
				(button as HTMLButtonElement).click();

				queueMicrotask(() => {
					const host = button.ownerDocument.querySelector('#drawer-left') as HTMLElement & {
						dialogElement: HTMLDialogElement | null;
					};

					const dialog = host.dialogElement;

					if (!dialog) throw new Error('Missing drawer dialog');

					const values: number[] = [];

					const sample = (): void => {
						values.push(dialog.getBoundingClientRect().x);

						if (values.length === 4) resolve(values);
						else requestAnimationFrame(sample);
					};

					requestAnimationFrame(sample);
				});
			});
		});

		expect(positions.some((position) => position < -1)).toBe(true);

		const dialog = page.getByRole('dialog', { name: 'Menu' });

		await expect.poll(async () => Math.round((await dialog.boundingBox())?.x ?? -1)).toBe(0);
	});
});

test('left drawer preserves the native mobile geometry and focus lifecycle', async ({ page }) => {
	await openDrawerStory(page);

	const example = page.locator('#drawer [data-story-example="Drawer — left and right"]');

	const trigger = example.getByRole('button', { name: 'Open left drawer' });

	await trigger.focus();

	await trigger.press('Enter');

	const dialog = page.getByRole('dialog', { name: 'Menu' });

	await expect(dialog).toBeVisible();

	await expect.poll(async () => Math.round((await dialog.boundingBox())?.x ?? -1)).toBe(0);

	const geometry = await dialog.evaluate((element) => {
		const bounds = element.getBoundingClientRect();

		const style = getComputedStyle(element);

		return {
			height: bounds.height,
			touchAction: style.touchAction,
			width: bounds.width,
			x: bounds.x,
			y: bounds.y,
		};
	});

	expect(geometry.x).toBe(0);

	expect(geometry.y).toBe(0);

	expect(geometry.width).toBeCloseTo(327.6, 0);

	expect(geometry.height).toBeCloseTo(844, 0);

	expect(geometry.touchAction).toBe('pan-y');

	await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

	await page.keyboard.press('Escape');

	await expect(dialog).toBeHidden();

	await expect(trigger).toBeFocused();

	await page.keyboard.press('Tab');

	expect(await page.locator('.alt-drawer:not([open]) :focus').count()).toBe(0);
});

test('top and bottom sheets are visually distinct full-width placements', async ({ page }) => {
	await openDrawerStory(page);

	const example = page.locator('#drawer [data-story-example="Mobile sheets — bottom and top"]');

	await example.getByRole('button', { name: 'Open bottom sheet' }).click();

	const bottom = page.getByRole('dialog', { name: 'Schedule publication' });

	await expect
		.poll(async () => {
			const box = await bottom.boundingBox();

			return Math.round((box?.y ?? 0) + (box?.height ?? 0));
		})
		.toBe(844);

	const bottomBox = await bottom.boundingBox();

	expect(bottomBox?.x).toBe(0);

	expect(bottomBox?.width).toBe(390);

	expect(Math.round((bottomBox?.y ?? 0) + (bottomBox?.height ?? 0))).toBe(844);

	await bottom.getByRole('button', { name: 'Close' }).click();

	await expect(bottom).toBeHidden();

	await example.getByRole('button', { name: 'Open top sheet' }).click();

	const top = page.getByRole('dialog', { name: 'Connection restored' });

	await expect.poll(async () => Math.round((await top.boundingBox())?.y ?? -1)).toBe(0);

	const topBox = await top.boundingBox();

	expect(topBox?.x).toBe(0);

	expect(topBox?.y).toBe(0);

	expect(topBox?.width).toBe(390);
});

test('drawer supports nested overlays and passes an accessibility audit', async ({ page }) => {
	await openDrawerStory(page);

	await page.getByRole('button', { name: 'Open bottom sheet' }).click();

	const dialog = page.getByRole('dialog', { name: 'Schedule publication' });

	await dialog.getByRole('combobox', { name: 'Channel' }).click();

	const popup = dialog.locator('.alt-select__popup');

	await expect(popup).toBeVisible();

	expect(await popup.evaluate((element) => element.matches(':popover-open'))).toBe(true);

	const result = await new AxeBuilder({ page }).include('#drawer').analyze();

	expect(result.violations.map(({ id }) => id)).toEqual([]);
});
