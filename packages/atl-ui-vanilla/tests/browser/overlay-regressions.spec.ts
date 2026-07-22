import { expect, test } from '@playwright/test';

test('dialog uses smooth motion, dynamic backdrop height and document scroll lock', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });

	await page.setViewportSize({ height: 700, width: 390 });

	await page.goto('/storybook.html#dialog');

	const trigger = page.getByRole('button', { name: '520 px' });

	const openingFrames = await trigger.evaluate((button) => {
		return new Promise<number[]>((resolve) => {
			(button as HTMLButtonElement).click();

			queueMicrotask(() => {
				const host = button.ownerDocument.querySelector('#dialog-520') as HTMLElement & {
					dialogElement: HTMLDialogElement | null;
				};

				const dialog = host.dialogElement;

				if (!dialog) throw new Error('Missing native dialog');

				const values: number[] = [];

				const sample = (): void => {
					values.push(Number(getComputedStyle(dialog).opacity));

					if (values.length === 5) resolve(values);
					else requestAnimationFrame(sample);
				};

				requestAnimationFrame(sample);
			});
		});
	});

	expect(openingFrames.some((opacity) => opacity < 0.95)).toBe(true);

	const dialog = page.locator('#dialog-520 .alt-dialog');

	await expect(dialog).toBeVisible();

	await expect
		.poll(async () => Number(await dialog.evaluate((element) => getComputedStyle(element).opacity)))
		.toBe(1);

	const initialViewportState = await dialog.evaluate((element) => ({
		backdropHeight: getComputedStyle(element, '::backdrop').height,
		bodyOverflow: getComputedStyle(element.ownerDocument.body).overflow,
		rootOverflow: getComputedStyle(element.ownerDocument.documentElement).overflow,
	}));

	expect(initialViewportState).toEqual({
		backdropHeight: '700px',
		bodyOverflow: 'hidden',
		rootOverflow: 'hidden',
	});

	await page.setViewportSize({ height: 844, width: 390 });

	await expect
		.poll(async () =>
			dialog.evaluate((element) => Number.parseFloat(getComputedStyle(element, '::backdrop').height)),
		)
		.toBeCloseTo(844, 1);

	const close = dialog.getByRole('button', { name: 'Close' });

	const closingState = await close.evaluate((button) => {
		(button as HTMLButtonElement).click();

		const ownerDialog = button.closest('dialog');

		return {
			nativeOpen: ownerDialog?.hasAttribute('open') ?? false,
			opacity: ownerDialog ? Number(getComputedStyle(ownerDialog).opacity) : 0,
		};
	});

	expect(closingState.nativeOpen).toBe(true);

	expect(closingState.opacity).toBeGreaterThan(0);

	await expect(dialog).toBeHidden();

	expect(
		await page.evaluate(() => ({
			bodyOverflow: document.body.style.overflow,
			rootOverflow: document.documentElement.style.overflow,
		})),
	).toEqual({ bodyOverflow: '', rootOverflow: '' });
});

test('collapse, tooltip and popup keep stable single-surface geometry', async ({ page }) => {
	await page.setViewportSize({ height: 800, width: 1280 });

	await page.goto('/storybook.html#collapse');

	const collapse = page.locator('#collapse [data-story-example="Multiple panels"] alt-collapse');

	const firstItem = collapse.locator('details[data-key="audience"]');

	expect(await firstItem.evaluate((element) => getComputedStyle(element).borderTopWidth)).toBe('0px');

	await collapse.locator('details[data-key="schedule"] p').evaluate((element) => {
		element.textContent = 'A-very-long-unbroken-collapse-value-that-must-never-resize-its-container';
	});

	const closedWidth = await collapse.evaluate((element) => element.getBoundingClientRect().width);

	await collapse.locator('details[data-key="schedule"] summary').click();

	const openWidth = await collapse.evaluate((element) => element.getBoundingClientRect().width);

	expect(openWidth).toBeCloseTo(closedWidth, 1);

	await page.goto('/storybook.html#tooltip');

	const tooltipExample = page.locator('#tooltip [data-story-example="Triggers and content"]');

	await tooltipExample.getByRole('button', { name: 'Click' }).click();

	const tooltip = tooltipExample.getByRole('tooltip');

	await expect(tooltip).toBeVisible();

	expect(await tooltip.evaluate((element) => getComputedStyle(element).overflow)).toBe('visible');

	await page.goto('/storybook.html#popup');

	const popupExample = page.locator('#popup [data-story-example="Placements"]');

	await popupExample.getByRole('button', { name: 'bottom-start' }).click();

	const popup = popupExample.locator('alt-popup[open]');

	await expect(popup).toBeVisible();

	const borders = await popup.evaluate((element) => {
		const content = element.querySelector('.alt-popup__content');

		return {
			content: content ? getComputedStyle(content).borderTopWidth : null,
			popup: getComputedStyle(element).borderTopWidth,
		};
	});

	expect(borders).toEqual({ content: '0px', popup: '1px' });
});
