import { expect, type Page, test } from '@playwright/test';

const openStory = async (page: Page, storyId: string): Promise<void> => {
	await page.goto(`/storybook.html#${storyId}`);

	await expect(page.locator(`#${storyId}`)).toBeVisible();
};

test('pagination and collapse use shared SVG icons instead of text glyphs', async ({ page }) => {
	await openStory(page, 'pagination');

	const pagination = page.locator('#pagination [data-story-example="Pages"] alt-pagination');

	const previous = pagination.getByRole('button', { name: 'Previous page' });

	const next = pagination.getByRole('button', { name: 'Next page' });

	await expect(previous).toHaveClass(/alt-button/);

	await expect(previous.locator('[data-alt-icon="chevron-left"]')).toBeVisible();

	await expect(next.locator('[data-alt-icon="chevron-right"]')).toBeVisible();

	await expect(pagination.locator('[data-alt-icon="more-horizontal"]')).toHaveCount(2);

	await openStory(page, 'collapse');

	const collapse = page.locator('#collapse [data-story-example="Multiple panels"] alt-collapse');

	const schedule = collapse.locator('details[data-key="schedule"]');

	await expect(collapse.locator('details[data-key="audience"] [data-alt-icon="minus"]')).toBeVisible();

	await expect(schedule.locator('[data-alt-icon="plus"]')).toBeVisible();

	await schedule.locator('summary').click();

	await expect(schedule.locator('[data-alt-icon="minus"]')).toBeVisible();
});

test('ordinary nested actions reuse the Button recipe', async ({ page }) => {
	await openStory(page, 'alert');

	await expect(page.locator('#alert .alt-alert__close').first()).toHaveClass(/alt-button/);

	await expect(page.locator('#alert .alt-alert__action-button')).toHaveClass(/alt-button/);

	await openStory(page, 'dropdown');

	await expect(
		page.locator('#dropdown [data-story-example="Multiple with footer"] .alt-listbox__select-all'),
	).toHaveClass(/alt-button/);

	await openStory(page, 'file-upload');

	await expect(page.locator('#file-upload .alt-file-upload__button').first()).toHaveClass(/alt-button/);

	await openStory(page, 'calendar');

	const calendar = page.locator('#calendar [data-story-example="Single date"] alt-calendar');

	await expect(calendar.locator('[data-action="previous"]')).toHaveClass(/alt-button/);

	await expect(calendar.locator('[data-action="reset"]')).toHaveClass(/alt-button/);
});
