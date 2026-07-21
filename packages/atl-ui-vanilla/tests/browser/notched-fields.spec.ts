import { expect, type Locator, type Page, test } from '@playwright/test';

type OutlineState = {
	path: string;
	shadow: string;
	stroke: string;
	strokeWidth: string;
};

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);
	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

const readOutline = async (root: Locator, pathSelector: string): Promise<OutlineState> => {
	return root.evaluate((element, selector) => {
		const path = element.querySelector<SVGPathElement>(selector);
		if (!path) throw new Error(`Missing outline path: ${selector}`);
		const rootStyles = getComputedStyle(element);
		const pathStyles = getComputedStyle(path);
		return {
			path: path.getAttribute('d') ?? '',
			shadow: rootStyles.boxShadow,
			stroke: pathStyles.stroke,
			strokeWidth: pathStyles.strokeWidth,
		};
	}, pathSelector);
};

const expectAlignedLabel = async (label: Locator, text: Locator): Promise<void> => {
	const positions = await label.evaluate((element, textElement) => {
		if (!(textElement instanceof HTMLElement)) throw new Error('Missing field text element');
		const labelRect = element.getBoundingClientRect();
		const textRect = textElement.getBoundingClientRect();
		return {
			labelText: labelRect.left + Number.parseFloat(getComputedStyle(element).paddingLeft),
			text: textRect.left,
		};
	}, await text.elementHandle());
	expect(Math.abs(positions.labelText - positions.text)).toBeLessThanOrEqual(1);
};

test('input focuses the same notched SVG border without an outer ring', async ({ page }) => {
	await openStory(page, 'input');
	const host = page.locator('#input [data-story-example="States"] alt-input').first();
	const root = host.locator('.alt-input__root');
	const before = await readOutline(root, '.alt-input__outline-path');
	await host.locator('input').focus();
	const focused = await readOutline(root, '.alt-input__outline-path');
	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);
	expect(focused.strokeWidth).toBe('2px');
	expect(focused.stroke).not.toBe(before.stroke);
	expect(focused.shadow).toBe(before.shadow);
	await expectAlignedLabel(host.locator('.alt-input__label'), host.locator('.alt-input__field'));
});

test('select uses the shared SVG notch and focus treatment', async ({ page }) => {
	await openStory(page, 'select');
	const host = page.locator('#select [data-story-example="States"] alt-select').first();
	const trigger = host.locator('.alt-select__trigger');
	const before = await readOutline(trigger, '.alt-select__outline-path');
	await trigger.focus();
	const focused = await readOutline(trigger, '.alt-select__outline-path');
	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);
	expect(focused.strokeWidth).toBe('2px');
	expect(focused.stroke).not.toBe(before.stroke);
	expect(focused.shadow).toBe(before.shadow);
	await expectAlignedLabel(host.locator('.alt-select__label'), host.locator('.alt-select__value'));
});

test('autocomplete inherits the input SVG while authored input stays consumer-owned', async ({ page }) => {
	await openStory(page, 'autocomplete');
	const standard = page.locator('#autocomplete [data-story-example="Selection modes"] alt-autocomplete').first();
	const root = standard.locator('.alt-input__root');
	await standard.locator('input').focus();
	const focused = await readOutline(root, '.alt-input__outline-path');
	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);
	expect(focused.strokeWidth).toBe('2px');
	const authored = page.locator('#autocomplete [data-story-example="Custom composition"] alt-autocomplete').first();
	await expect(authored.locator('.alt-input__outline')).toHaveCount(0);
});
