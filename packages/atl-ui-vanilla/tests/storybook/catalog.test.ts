import { beforeEach, describe, expect, it } from 'vitest';

import { bindCatalogControls } from '../../demo/storybook/catalog-controls';
import { renderNavigation } from '../../demo/storybook/navigation';
import { renderStory } from '../../demo/storybook/render-story';
import { stories } from '../../demo/storybook/stories';

const getElement = <ElementType extends HTMLElement>(selector: string): ElementType => {
	const element = document.querySelector<ElementType>(selector);
	if (!element) throw new Error(`Missing test element: ${selector}`);
	return element;
};

beforeEach(() => {
	document.documentElement.dataset.altTheme = 'light';
	document.body.innerHTML = `
		<input aria-label="Search components" id="catalog-search" type="search" />
		<button id="catalog-theme">Dark theme</button>
		<p id="catalog-count"></p>
		<nav id="catalog-navigation"></nav>
		<main id="catalog-content"></main>`;
	const navigation = getElement<HTMLElement>('#catalog-navigation');
	const content = getElement<HTMLElement>('#catalog-content');
	renderNavigation(navigation, stories);
	content.append(...stories.map(renderStory));
});

describe('component storybook catalog', () => {
	it('contains one uniquely addressable story for every supported component', () => {
		const ids = stories.map((story) => story.id);

		expect(stories).toHaveLength(23);
		expect(new Set(ids).size).toBe(ids.length);
		expect(ids).toEqual(
			expect.arrayContaining(['alert', 'autocomplete', 'button', 'dialog', 'input', 'select', 'table', 'toast']),
		);
	});

	it('documents variants through titled examples and renderable markup', () => {
		for (const story of stories) {
			expect(story.examples.length, story.id).toBeGreaterThan(0);
			for (const example of story.examples) {
				expect(example.title.length, story.id).toBeGreaterThan(0);
				expect(example.markup.trim().length, `${story.id}/${example.title}`).toBeGreaterThan(0);
			}
		}
	});

	it('shows arbitrary consumer SVG in every authored icon recipe', () => {
		const authoredIconStories = ['alert', 'breadcrumbs', 'button', 'chip', 'dialog', 'sidebar', 'tabs'];

		for (const storyId of authoredIconStories) {
			const icon = document.querySelector(`#${storyId} [data-story-custom-icon="spark"]`);
			expect(icon, storyId).toBeInstanceOf(SVGSVGElement);
		}
	});

	it('filters sections and hides empty navigation groups', () => {
		bindCatalogControls();
		const search = getElement<HTMLInputElement>('#catalog-search');
		search.value = 'toast';
		search.dispatchEvent(new Event('input'));

		const visibleStories = Array.from(document.querySelectorAll<HTMLElement>('.alt-story')).filter(
			(story) => !story.hidden,
		);
		const visibleGroups = Array.from(document.querySelectorAll<HTMLElement>('[data-story-group]')).filter(
			(group) => !group.hidden,
		);
		expect(visibleStories.map((story) => story.id)).toEqual(['toast']);
		expect(visibleGroups).toHaveLength(1);
		expect(getElement('#catalog-count').textContent).toBe('1 component');
	});

	it('switches the catalog theme', () => {
		bindCatalogControls();
		getElement<HTMLButtonElement>('#catalog-theme').click();

		expect(document.documentElement.dataset.altTheme).toBe('dark');
		expect(getElement('#catalog-theme').textContent).toBe('Light theme');
	});
});
