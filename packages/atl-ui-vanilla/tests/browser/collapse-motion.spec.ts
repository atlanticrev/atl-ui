import { expect, type Locator, test } from '@playwright/test';

type ObservedCollapse = HTMLElement & {
	animationProbe?: { keys: Set<string>; observer: MutationObserver };
};

const readHeight = (item: Locator): Promise<number> => {
	return item.evaluate((element) => element.getBoundingClientRect().height);
};

test('collapse animates authored details in both directions', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });

	await page.goto('/storybook.html#collapse');

	const collapse = page.locator('#collapse [data-story-example="Multiple panels"] alt-collapse');

	const item = collapse.locator('details[data-key="schedule"]');

	const summary = item.locator('summary');

	const closedHeight = await readHeight(item);

	await summary.click();

	await expect(item).toHaveAttribute('data-alt-collapse-animating', 'true');

	await expect(item).not.toHaveAttribute('data-alt-collapse-animating', 'true');

	const openHeight = await readHeight(item);

	expect(openHeight).toBeGreaterThan(closedHeight);

	expect(await item.evaluate((element) => element.getAnimations().length)).toBe(0);

	await summary.click();

	await expect(item).toHaveAttribute('data-alt-collapse-animating', 'true');

	await expect(item).not.toHaveAttribute('data-alt-collapse-animating', 'true');

	expect(Math.abs((await readHeight(item)) - closedHeight)).toBeLessThanOrEqual(1);

	expect(await item.evaluate((element) => element.getAnimations().length)).toBe(0);
});

test('single-panel collapse animates the previous item closed', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'no-preference' });

	await page.goto('/storybook.html#collapse');

	const collapse = page.locator('#collapse [data-story-example="Single panel"] alt-collapse');

	const audience = collapse.locator('details[data-key="audience"]');

	const schedule = collapse.locator('details[data-key="schedule"]');

	await collapse.evaluate((element) => {
		const target = element as ObservedCollapse;

		const keys = new Set<string>();

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				const item = mutation.target as HTMLDetailsElement;

				if (item.dataset.altCollapseAnimating === 'true' && item.dataset.key) keys.add(item.dataset.key);
			}
		});

		observer.observe(target, { attributeFilter: ['data-alt-collapse-animating'], attributes: true, subtree: true });

		target.animationProbe = { keys, observer };
	});

	await schedule.locator('summary').click();

	await expect
		.poll(() =>
			collapse.evaluate((element) => [...((element as ObservedCollapse).animationProbe?.keys ?? [])].sort()),
		)
		.toEqual(['audience', 'schedule']);

	await expect(audience).not.toHaveAttribute('data-alt-collapse-animating', 'true');

	await expect(schedule).not.toHaveAttribute('data-alt-collapse-animating', 'true');

	await collapse.evaluate((element) => {
		const target = element as ObservedCollapse;

		target.animationProbe?.observer.disconnect();

		delete target.animationProbe;
	});

	expect(
		await collapse.locator('details[open]').evaluateAll((items) => items.map((item) => item.dataset.key)),
	).toEqual(['schedule']);
});

test('collapse respects reduced motion', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });

	await page.goto('/storybook.html#collapse');

	const item = page.locator('#collapse [data-story-example="Multiple panels"] details[data-key="schedule"]');

	await item.locator('summary').click();

	await expect(item).toHaveAttribute('open', '');

	await expect(item).not.toHaveAttribute('data-alt-collapse-animating', 'true');

	expect(await item.evaluate((element) => element.getAnimations().length)).toBe(0);
});
