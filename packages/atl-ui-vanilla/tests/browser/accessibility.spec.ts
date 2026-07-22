import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '@playwright/test';

const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const audit = async (page: Page, include?: string): Promise<void> => {
	let builder = new AxeBuilder({ page }).withTags(WCAG_TAGS);

	if (include) builder = builder.include(include);

	const result = await builder.analyze();

	const summary = result.violations.map((violation) => ({
		help: violation.help,
		id: violation.id,
		nodes: violation.nodes.map((node) => ({ failure: node.failureSummary, target: node.target })),
	}));

	expect(summary).toEqual([]);
};

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);

	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

test('catalog and all static component states pass WCAG A and AA rules', async ({ page }) => {
	await openStory(page, 'alert');

	await audit(page);
});

test('open select and autocomplete states remain accessible', async ({ page }) => {
	await openStory(page, 'select');

	const select = page.locator('#select [data-story-example="Sizes"] alt-select').first();

	await select.getByRole('combobox').click();

	await expect(select.getByRole('listbox')).toBeVisible();

	await audit(page, '#select');

	await page.keyboard.press('Escape');

	const autocomplete = page.locator('#autocomplete alt-autocomplete').first();

	await autocomplete.getByRole('combobox').focus();

	await expect(autocomplete.getByRole('listbox')).toBeVisible();

	await audit(page, '#autocomplete');
});

test('open dialog remains accessible', async ({ page }) => {
	await openStory(page, 'dialog');

	await page.locator('#dialog').getByRole('button', { name: '520 px' }).click();

	const dialog = page.getByRole('dialog');

	await expect(dialog).toBeVisible();

	await audit(page, 'dialog[open]');
});

test('visible tooltip remains accessible', async ({ page }) => {
	await openStory(page, 'tooltip');

	const tooltipExample = page.locator('#tooltip [data-story-example="Placements"]');

	await tooltipExample.getByRole('button', { name: 'Top' }).focus();

	await expect(tooltipExample.getByRole('tooltip')).toBeVisible();

	await audit(page, '#tooltip');
});

test('visible toast remains accessible', async ({ page }) => {
	await openStory(page, 'toast');

	await page.locator('#toast').getByRole('button', { name: 'Info' }).click();

	const toast = page.locator('alt-toast-region [role="status"]');

	await expect(toast).toBeVisible();

	await toast.evaluate(async (element) => {
		const animations = element.getAnimations();

		await Promise.allSettled(animations.map((animation) => animation.finished));
	});

	await audit(page, 'alt-toast-region');
});
