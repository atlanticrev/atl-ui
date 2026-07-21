import { defineAllAltElements } from '../src';

import { bindCatalogControls } from './storybook/catalog-controls';
import { findElement } from './storybook/dom';
import { renderNavigation } from './storybook/navigation';
import { renderStory } from './storybook/render-story';
import { stories } from './storybook/stories';

type CatalogState = {
	componentCount: number;
	errors: string[];
	ready: boolean;
};

defineAllAltElements();

const state: CatalogState = {
	componentCount: stories.length,
	errors: [],
	ready: false,
};
Reflect.set(window, 'altStorybook', state);
window.addEventListener('error', (event) => state.errors.push(event.message));
window.addEventListener('unhandledrejection', (event) => state.errors.push(String(event.reason)));

const navigation = findElement<HTMLElement>(document, '#catalog-navigation');
const content = findElement<HTMLElement>(document, '#catalog-content');
renderNavigation(navigation, stories);

for (const story of stories) {
	const section = renderStory(story);
	content.append(section);
	story.setup?.(section);
}

bindCatalogControls();
state.ready = true;
document.documentElement.dataset.storybookReady = 'true';
