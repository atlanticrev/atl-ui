import { expect, type Locator, type Page, test } from '@playwright/test';

type Box = { height: number; width: number };

const openSkeletonStory = async (page: Page): Promise<void> => {
	await page.goto('/storybook.html#skeleton');

	await expect(page.locator('#skeleton')).toBeVisible();
};

const readBox = (locator: Locator): Promise<Box> =>
	locator.evaluate((element) => {
		const bounds = element.getBoundingClientRect();

		return { height: bounds.height, width: bounds.width };
	});

const expectSameBox = (loading: Box, ready: Box): void => {
	expect(Math.abs(loading.height - ready.height)).toBeLessThanOrEqual(0.5);

	expect(Math.abs(loading.width - ready.width)).toBeLessThanOrEqual(0.5);
};

test('Skeleton Host keeps geometry and inherits the covered surface radius', async ({ page }) => {
	await openSkeletonStory(page);

	const host = page.locator('[data-skeleton-host]');

	const toggle = page.locator('[data-skeleton-toggle]');

	const loadingDesktop = await readBox(host);

	const surface = await host.evaluate((element) => ({
		background: getComputedStyle(element, '::before').backgroundColor,
		hostRadius: getComputedStyle(element).borderRadius,
		overlayRadius: getComputedStyle(element, '::before').borderRadius,
	}));

	expect(surface).toEqual({
		background: 'rgb(232, 237, 243)',
		hostRadius: '24px',
		overlayRadius: '24px',
	});

	await toggle.click();

	expectSameBox(loadingDesktop, await readBox(host));

	await page.setViewportSize({ height: 844, width: 390 });

	await toggle.click();

	const loadingMobile = await readBox(host);

	await toggle.click();

	expectSameBox(loadingMobile, await readBox(host));
});

test('Atomic Skeleton uses the system radius by default', async ({ page }) => {
	await openSkeletonStory(page);

	const skeleton = page.locator('.alt-skeleton:not([data-shape])').first();

	expect(await skeleton.evaluate((element) => getComputedStyle(element).borderRadius)).toBe('10px');
});

test('Skeleton Host removes content from focus while loading', async ({ page }) => {
	await openSkeletonStory(page);

	const contentButton = page.getByRole('button', { name: 'Review publication', includeHidden: true });

	await contentButton.evaluate((element) => element.focus());

	expect(await contentButton.evaluate((element) => document.activeElement === element)).toBe(false);

	await page.locator('[data-skeleton-toggle]').click();

	await contentButton.focus();

	await expect(contentButton).toBeFocused();
});

test('Skeleton Host fades out without delaying ready content', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });

	await openSkeletonStory(page);

	const host = page.locator('[data-skeleton-host]');

	await host.evaluate((element) => element.style.setProperty('--alt-skeleton-fade-duration', '10s'));

	await page.locator('[data-skeleton-toggle]').click();

	const transition = await host.evaluate(
		(element) =>
			new Promise<{
				contentVisibility: string;
				opacity: number;
				overlayTransform: string;
				overlayVisibility: string;
			}>((resolve) => {
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						resolve({
							contentVisibility: getComputedStyle(element.firstElementChild as Element).visibility,
							opacity: Number(getComputedStyle(element, '::before').opacity),
							overlayTransform: getComputedStyle(element, '::after').transform,
							overlayVisibility: getComputedStyle(element, '::before').visibility,
						});
					});
				});
			}),
	);

	expect(transition.contentVisibility).toBe('visible');

	expect(transition.overlayVisibility).toBe('visible');

	expect(transition.overlayTransform).toBe('none');

	expect(transition.opacity).toBeGreaterThan(0);

	expect(transition.opacity).toBeLessThan(1);

	await host.evaluate((element) => {
		for (const animation of element.getAnimations({ subtree: true })) {
			if (animation.effect?.getTiming().iterations !== Infinity) animation.finish();
		}
	});

	expect(await host.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0');

	expect(await host.evaluate((element) => getComputedStyle(element, '::before').visibility)).toBe('hidden');
});

test('Skeleton Host disables shimmer and fade for reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await openSkeletonStory(page);

	const host = page.locator('[data-skeleton-host]');

	expect(await host.evaluate((element) => getComputedStyle(element, '::after').animationName)).toBe('none');

	await page.locator('[data-skeleton-toggle]').click();

	expect(await host.evaluate((element) => getComputedStyle(element, '::before').transitionDuration)).toBe('0s');

	expect(await host.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0');
});
