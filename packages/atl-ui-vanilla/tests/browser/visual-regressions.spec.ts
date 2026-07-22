import { expect, type Page, test } from '@playwright/test';

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);

	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

test('filled warning alert uses white content on a darker orange', async ({ page }) => {
	await openStory(page, 'alert');

	const alert = page.locator(
		'#alert [data-story-example="Variants"] alt-alert[severity="warning"][variant="filled"]',
	);

	const colors = await alert.evaluate((element) => {
		const icon = element.querySelector('.alt-alert__icon');

		return {
			background: getComputedStyle(element).backgroundColor,
			icon: icon ? getComputedStyle(icon).color : '',
			text: getComputedStyle(element).color,
		};
	});

	expect(colors.background).toBe('rgb(181, 71, 8)');

	expect(colors.icon).toBe('rgb(255, 255, 255)');

	expect(colors.text).toBe('rgb(255, 255, 255)');
});

test('alerts fit short content and stay within narrow containers', async ({ page }) => {
	await openStory(page, 'alert');

	const shortAlert = page.locator('#alert [data-story-example="Severities"] alt-alert[severity="success"]');

	const shortContainer = page.locator('#alert [data-story-example="Severities"] .alt-catalog-story-stack');

	const narrowFrame = page.locator('#alert [data-story-example="Long content"] .alt-catalog-stress-frame');

	const longAlert = narrowFrame.locator('alt-alert');

	const [shortAlertBox, shortContainerBox, narrowFrameBox, longAlertBox] = await Promise.all(
		[shortAlert, shortContainer, narrowFrame, longAlert].map(async (element) => element.boundingBox()),
	);

	expect(shortAlertBox?.width ?? 0).toBeLessThan(shortContainerBox?.width ?? 0);

	expect(longAlertBox?.width ?? 0).toBeLessThanOrEqual(narrowFrameBox?.width ?? 0);
});

test('checked radio has a visible inner dot', async ({ page }) => {
	await openStory(page, 'radio');

	const radio = page.locator('#radio input.alt-radio__control:checked').first();

	const dot = await radio.evaluate((element) => {
		const style = getComputedStyle(element, '::before');
		return { height: style.height, transform: style.transform, width: style.width };
	});

	expect(dot).toEqual({ height: '10px', transform: 'matrix(1, 0, 0, 1, 0, 0)', width: '10px' });
});

test('collapsed sidebar items are centered squares', async ({ page }) => {
	await openStory(page, 'sidebar');

	const item = page.locator('#sidebar [data-collapsed="true"] .alt-sidebar__item').first();

	const geometry = await item.evaluate((element) => {
		const itemRect = element.getBoundingClientRect();

		const iconRect = element.querySelector('svg')?.getBoundingClientRect();

		return {
			height: itemRect.height,
			iconOffset: iconRect ? iconRect.left + iconRect.width / 2 - (itemRect.left + itemRect.width / 2) : 1,
			width: itemRect.width,
		};
	});

	expect(geometry.height).toBe(40);

	expect(geometry.width).toBe(40);

	expect(Math.abs(geometry.iconOffset)).toBeLessThanOrEqual(0.5);
});

test('tab icon and label stay on one line', async ({ page }) => {
	await openStory(page, 'tabs');

	const tab = page.locator('#tabs [data-story-example="Horizontal"] [data-key="analytics"][role="tab"]');

	const styles = await tab.evaluate((element) => ({
		display: getComputedStyle(element).display,
		height: element.getBoundingClientRect().height,
		whiteSpace: getComputedStyle(element).whiteSpace,
	}));

	expect(styles).toEqual({ display: 'flex', height: 36, whiteSpace: 'nowrap' });
});

test('catalog search uses alt-search with shared SVG icons', async ({ page }) => {
	await page.goto('/storybook.html');

	const search = page.locator('alt-search#catalog-search');

	await expect(search).toBeVisible();

	await expect(search.locator('.alt-search__field')).toHaveAttribute('type', 'search');

	await expect(search.locator('[data-alt-icon="search"]')).toBeVisible();

	await search.locator('.alt-search__field').fill('toast');

	await expect(page.locator('#catalog-count')).toHaveText('1 component');

	const clear = search.locator('.alt-search__clear');

	await expect(clear.locator('[data-alt-icon="close"]')).toBeVisible();

	await clear.click();

	await expect(page.locator('#catalog-count')).toHaveText('32 components');
});
