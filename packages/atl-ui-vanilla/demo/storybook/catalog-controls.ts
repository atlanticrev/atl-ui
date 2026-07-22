import { type AltInputElementApi, createAltIcon } from '../../src';

import { findElement, findElements } from './dom';
import { setActiveNavigation } from './navigation';

const updateVisibleStories = (query: string): void => {
	const normalized = query.trim().toLowerCase();

	const stories = findElements<HTMLElement>(document, '.alt-story');

	let visible = 0;

	for (const story of stories) {
		const matches = !normalized || story.dataset.search?.includes(normalized);

		story.hidden = !matches;

		visible += Number(matches);

		const link = document.querySelector<HTMLElement>(`[data-story-link="${story.id}"]`);

		if (link) link.hidden = !matches;
	}

	for (const group of findElements<HTMLElement>(document, '[data-story-group]')) {
		const links = findElements<HTMLElement>(group, '[data-story-link]');

		group.hidden = links.every((link) => link.hidden);
	}

	const componentLabel = visible === 1 ? 'component' : 'components';

	findElement<HTMLElement>(document, '#catalog-count').textContent = `${visible} ${componentLabel}`;
};

export const bindCatalogControls = (): void => {
	const search = findElement<AltInputElementApi>(document, '#catalog-search');

	const themeButton = findElement<HTMLButtonElement>(document, '#catalog-theme');

	search.leadingIcon = createAltIcon(document, 'search', { size: 16 });

	search.addEventListener('alt-input', () => updateVisibleStories(search.value));

	themeButton.addEventListener('click', () => {
		const dark = document.documentElement.dataset.altTheme !== 'dark';

		document.documentElement.dataset.altTheme = dark ? 'dark' : 'light';

		themeButton.textContent = dark ? 'Light theme' : 'Dark theme';
	});

	updateVisibleStories('');

	window.addEventListener('hashchange', () => setActiveNavigation(location.hash.slice(1)));

	setActiveNavigation(location.hash.slice(1));
};
