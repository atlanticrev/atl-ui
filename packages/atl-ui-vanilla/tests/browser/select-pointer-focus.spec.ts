import { expect, type Locator, type Page, test } from '@playwright/test';

type SelectGeometry = {
	labelLeft: number;
	labelTextLeft: number;
	notchSegments: number;
	valueLeft: number;
};

const openSelectStory = async (page: Page): Promise<void> => {
	await page.goto('/storybook.html#select');

	await expect(page.locator('#select')).toBeVisible();
};

const readGeometry = async (host: Locator): Promise<SelectGeometry> => {
	return host.evaluate((element) => {
		const label = element.querySelector('.alt-select__label');

		const value = element.querySelector('.alt-select__value');

		const path = element.querySelector('.alt-select__outline-path');

		if (!(label instanceof HTMLElement) || !(value instanceof HTMLElement) || !(path instanceof SVGPathElement)) {
			throw new Error('Missing standard Select outline parts');
		}

		const labelBounds = label.getBoundingClientRect();

		const valueBounds = value.getBoundingClientRect();

		const labelPadding = Number.parseFloat(getComputedStyle(label).paddingLeft) || 0;

		return {
			labelLeft: labelBounds.left,
			labelTextLeft: labelBounds.left + labelPadding,
			notchSegments: path.getAttribute('d')?.match(/M /g)?.length ?? 0,
			valueLeft: valueBounds.left,
		};
	});
};

test('empty Select keeps its floating label aligned while pointer focus is held', async ({ page }) => {
	await openSelectStory(page);

	const host = page.locator('#select [data-story-example="States"] alt-select').nth(1);

	const trigger = host.locator('.alt-select__trigger');

	const label = host.locator('.alt-select__label');

	await trigger.hover();

	await page.mouse.down();

	let heldGeometry: SelectGeometry | undefined;

	try {
		await trigger.evaluate((element) => element.focus());

		await expect(trigger).toBeFocused();

		await expect(host).toHaveAttribute('data-label-float', 'false');

		await expect(host).toHaveAttribute('data-open', 'false');

		await expect.poll(() => label.evaluate((element) => getComputedStyle(element).top)).toBe('0px');

		await expect
			.poll(async () => {
				const geometry = await readGeometry(host);

				return {
					aligned: Math.abs(geometry.labelTextLeft - geometry.valueLeft) <= 1,
					notchOpen: geometry.notchSegments >= 2,
				};
			})
			.toEqual({ aligned: true, notchOpen: true });

		heldGeometry = await readGeometry(host);
	} finally {
		await page.mouse.up();
	}

	if (!heldGeometry) {
		throw new Error('Missing Select geometry while pointer focus was held');
	}

	await expect(host).toHaveAttribute('data-open', 'true');

	const openGeometry = await readGeometry(host);

	expect(Math.abs(openGeometry.labelLeft - heldGeometry.labelLeft)).toBeLessThanOrEqual(1);
});
