import type { StoryDefinition } from './types';

const GROUPS: readonly StoryDefinition['group'][] = ['Native CSS', 'Behavioral', 'Complex'];

const createLink = (story: StoryDefinition): HTMLAnchorElement => {
	const link = document.createElement('a');
	link.className = 'alt-catalog-nav__link';
	link.dataset.storyLink = story.id;
	link.href = `#${story.id}`;
	link.textContent = story.title;
	return link;
};

export const renderNavigation = (
	root: HTMLElement,
	stories: readonly StoryDefinition[],
): void => {
	for (const group of GROUPS) {
		const storiesInGroup = stories.filter((story) => story.group === group);
		const section = document.createElement('section');
		section.className = 'alt-catalog-nav__group';
		section.dataset.storyGroup = group;
		const title = document.createElement('h2');
		title.className = 'alt-catalog-nav__title';
		title.textContent = group;
		const links = document.createElement('div');
		links.className = 'alt-catalog-nav__links';
		links.append(...storiesInGroup.map(createLink));
		section.append(title, links);
		root.append(section);
	}
};

export const setActiveNavigation = (id: string): void => {
	const links = Array.from(document.querySelectorAll<HTMLElement>('[data-story-link]'));

	for (const link of links) {
		link.toggleAttribute('aria-current', link.dataset.storyLink === id);
	}
};
