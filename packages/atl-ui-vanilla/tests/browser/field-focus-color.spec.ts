import { expect, type Locator, type Page, test } from '@playwright/test';

type FocusTarget = {
	field: string;
	host: string;
	label: string;
	outline: string;
	story: string;
};

const targets: readonly FocusTarget[] = [
	{
		field: 'input',
		host: '#input [data-story-example="States"] alt-input',
		label: '.alt-input__label',
		outline: '.alt-input__outline-path',
		story: 'input',
	},
	{
		field: '.alt-select__trigger',
		host: '#select [data-story-example="States"] alt-select',
		label: '.alt-select__label',
		outline: '.alt-select__outline-path',
		story: 'select',
	},
	{
		field: 'input',
		host: '#autocomplete [data-story-example="Selection modes"] alt-autocomplete',
		label: '.alt-input__label',
		outline: '.alt-input__outline-path',
		story: 'autocomplete',
	},
];

const readFocusColor = async (page: Page, target: FocusTarget, theme: 'dark' | 'light'): Promise<string> => {
	await page.goto(`/storybook.html#${target.story}`);

	await page.evaluate((nextTheme) => {
		document.documentElement.dataset.altTheme = nextTheme;
	}, theme);

	const host = page.locator(target.host).first();

	await host.locator(target.field).focus();

	const label = host.locator(target.label);

	const outline = host.locator(target.outline);

	await expect
		.poll(async () => {
			const colors = await readColors(label, outline);

			return colors.label === colors.outline;
		})
		.toBe(true);

	const colors = await readColors(label, outline);

	return colors.label;
};

const readColors = async (label: Locator, outline: Locator): Promise<{ label: string; outline: string }> => {
	return {
		label: await label.evaluate((element) => getComputedStyle(element).color),
		outline: await outline.evaluate((element) => getComputedStyle(element).stroke),
	};
};

test('input, select and autocomplete share the floating-label focus color', async ({ page }) => {
	for (const theme of ['light', 'dark'] as const) {
		const colors: string[] = [];

		for (const target of targets) colors.push(await readFocusColor(page, target, theme));

		expect(new Set(colors).size).toBe(1);
	}
});
