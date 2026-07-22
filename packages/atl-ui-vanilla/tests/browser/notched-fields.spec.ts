import { expect, type Locator, type Page, test } from '@playwright/test';

type OutlineState = {
	path: string;
	shadow: string;
	stroke: string;
	strokeWidth: string;
};

type BorderState = {
	borderColor: string;
	borderWidth: string;
	height: number;
	shadow: string;
	sharedBorderColor: string;
	sharedShadow: string;
	width: number;
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

const readCustomProperty = async (element: Locator, property: string): Promise<string> => {
	return element.evaluate((node, name) => getComputedStyle(node).getPropertyValue(name).trim(), property);
};

const readBorder = async (element: Locator): Promise<BorderState> => {
	return element.evaluate((node) => {
		const probe = document.createElement('span');

		probe.style.borderColor = 'var(--alt-color-accent)';

		probe.style.boxShadow = 'inset 0 0 0 1px var(--alt-color-accent), var(--alt-shadow-sm)';

		probe.style.position = 'absolute';

		probe.style.visibility = 'hidden';

		node.append(probe);

		const bounds = node.getBoundingClientRect();

		const styles = getComputedStyle(node);

		const probeStyles = getComputedStyle(probe);

		const state = {
			borderColor: styles.borderTopColor,
			borderWidth: styles.borderTopWidth,
			height: bounds.height,
			shadow: styles.boxShadow,
			sharedBorderColor: probeStyles.borderTopColor,
			sharedShadow: probeStyles.boxShadow,
			width: bounds.width,
		};

		probe.remove();

		return state;
	});
};

const readSearchContentPositions = async (root: Locator): Promise<number[]> => {
	return root.evaluate((node) => {
		return ['.alt-search__icon', '.alt-search__field', '.alt-search__clear'].map((selector) => {
			const element = node.querySelector(selector);

			if (!(element instanceof Element)) throw new Error(`Missing search part: ${selector}`);

			return element.getBoundingClientRect().left;
		});
	});
};

const expectFocusedLabelStyle = async (label: Locator, outline: Locator): Promise<void> => {
	await expect
		.poll(async () => {
			const color = await label.evaluate((element) => getComputedStyle(element).color);

			const fontWeight = await label.evaluate((element) => getComputedStyle(element).fontWeight);

			const stroke = await outline.evaluate((element) => getComputedStyle(element).stroke);

			return { colorMatchesOutline: color === stroke, fontWeight };
		})
		.toEqual({ colorMatchesOutline: true, fontWeight: '400' });
};

const expectAlignedLabel = async (label: Locator, text: Locator): Promise<void> => {
	const positions = await label.evaluate(
		(element, textElement) => {
			if (!(textElement instanceof HTMLElement)) throw new Error('Missing field text element');

			const labelRect = element.getBoundingClientRect();

			const textRect = textElement.getBoundingClientRect();

			return {
				labelText: labelRect.left + Number.parseFloat(getComputedStyle(element).paddingLeft),
				text: textRect.left,
			};
		},
		await text.elementHandle(),
	);

	expect(Math.abs(positions.labelText - positions.text)).toBeLessThanOrEqual(1);
};

test('input focuses the same notched SVG border without an outer ring', async ({ page }) => {
	await openStory(page, 'input');

	const host = page.locator('#input [data-story-example="States"] alt-input').first();

	const root = host.locator('.alt-input__root');

	const before = await readOutline(root, '.alt-input__outline-path');

	await host.locator('input').focus();

	await expect.poll(async () => (await readOutline(root, '.alt-input__outline-path')).stroke).not.toBe(before.stroke);

	const focused = await readOutline(root, '.alt-input__outline-path');

	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);

	expect(focused.strokeWidth).toBe('2px');

	expect(focused.stroke).not.toBe(before.stroke);

	expect(focused.shadow).toBe(before.shadow);

	await expectAlignedLabel(host.locator('.alt-input__label'), host.locator('.alt-input__field'));

	await expectFocusedLabelStyle(host.locator('.alt-input__label'), host.locator('.alt-input__outline-path'));
});

test('select uses the shared SVG notch and focus treatment', async ({ page }) => {
	await openStory(page, 'select');

	const host = page.locator('#select [data-story-example="States"] alt-select').first();

	const trigger = host.locator('.alt-select__trigger');

	const before = await readOutline(trigger, '.alt-select__outline-path');

	await trigger.focus();

	await expect
		.poll(async () => (await readOutline(trigger, '.alt-select__outline-path')).stroke)
		.not.toBe(before.stroke);

	const focused = await readOutline(trigger, '.alt-select__outline-path');

	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);

	expect(focused.strokeWidth).toBe('2px');

	expect(focused.shadow).toBe(before.shadow);

	await expectAlignedLabel(host.locator('.alt-select__label'), host.locator('.alt-select__value'));

	await expectFocusedLabelStyle(host.locator('.alt-select__label'), host.locator('.alt-select__outline-path'));
});

test('select keeps its pointer-focused border color while hovered', async ({ page }) => {
	await openStory(page, 'select');

	const host = page.locator('#select [data-story-example="States"] alt-select').first();

	const trigger = host.locator('.alt-select__trigger');

	const accentColor = await readCustomProperty(trigger, '--alt-color-accent');

	await trigger.hover();

	await page.mouse.down();

	await trigger.evaluate((element) => (element as HTMLElement).focus());

	await page.mouse.move(0, 0);

	await page.mouse.up();

	await expect(trigger).toBeFocused();

	await expect.poll(() => readCustomProperty(trigger, '--alt-select-border-color')).toBe(accentColor);

	await trigger.hover();

	await expect(trigger).toBeFocused();

	await expect.poll(() => readCustomProperty(trigger, '--alt-select-border-color')).toBe(accentColor);
});

test('autocomplete inherits the input SVG while authored input stays consumer-owned', async ({ page }) => {
	await openStory(page, 'autocomplete');

	const standard = page.locator('#autocomplete [data-story-example="Selection modes"] alt-autocomplete').first();

	const root = standard.locator('.alt-input__root');

	await standard.locator('input').focus();

	const focused = await readOutline(root, '.alt-input__outline-path');

	expect(focused.path.match(/M /g)?.length).toBeGreaterThanOrEqual(2);

	expect(focused.strokeWidth).toBe('2px');

	await expectFocusedLabelStyle(standard.locator('.alt-input__label'), standard.locator('.alt-input__outline-path'));

	const authored = page.locator('#autocomplete [data-story-example="Custom composition"] alt-autocomplete').first();

	await expect(authored.locator('.alt-input__outline')).toHaveCount(0);
});

test('search uses the shared field focus treatment without changing its size', async ({ page }) => {
	await openStory(page, 'search');

	const search = page.locator('#search [data-story-example="Default"] alt-search');

	const root = search.locator('.alt-search__root');

	const before = await readBorder(root);

	const contentBefore = await readSearchContentPositions(root);

	await search.locator('.alt-search__field').focus();

	const focused = await readBorder(root);

	const contentFocused = await readSearchContentPositions(root);

	expect(focused.borderColor).toBe(focused.sharedBorderColor);

	expect(focused.borderColor).not.toBe(before.borderColor);

	expect(focused.borderWidth).toBe(before.borderWidth);

	expect(focused.shadow).toBe(focused.sharedShadow);

	expect({ height: focused.height, width: focused.width }).toEqual({ height: before.height, width: before.width });

	expect(contentFocused).toEqual(contentBefore);
});

test('search clear icon is geometrically centered inside its button', async ({ page }) => {
	await openStory(page, 'search');

	const clear = page.locator('#search [data-story-example="With value"] .alt-search__clear');

	const geometry = await clear.evaluate((button) => {
		const icon = button.querySelector('[data-alt-icon="close"]');

		if (!(icon instanceof SVGSVGElement)) throw new Error('Missing SVG close icon');

		const buttonBounds = button.getBoundingClientRect();

		const iconBounds = icon.getBoundingClientRect();

		return {
			buttonCenter: {
				x: buttonBounds.left + buttonBounds.width / 2,
				y: buttonBounds.top + buttonBounds.height / 2,
			},
			iconCenter: { x: iconBounds.left + iconBounds.width / 2, y: iconBounds.top + iconBounds.height / 2 },
			iconSize: { height: iconBounds.height, width: iconBounds.width },
		};
	});

	expect(geometry.iconCenter).toEqual(geometry.buttonCenter);

	expect(geometry.iconSize).toEqual({ height: 16, width: 16 });
});

test('date picker trigger uses the shared field focus treatment', async ({ page }) => {
	await openStory(page, 'date-picker');

	const trigger = page.locator('#date-picker [data-story-example="Single date"] .alt-date-picker__trigger');

	const before = await readBorder(trigger);

	await trigger.focus();

	const focused = await readBorder(trigger);

	expect(focused.borderColor).toBe(focused.sharedBorderColor);

	expect(focused.borderColor).not.toBe(before.borderColor);

	expect(focused.borderWidth).toBe(before.borderWidth);

	expect(focused.shadow).toBe(focused.sharedShadow);

	expect({ height: focused.height, width: focused.width }).toEqual({ height: before.height, width: before.width });
});
