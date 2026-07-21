import type { StoryDefinition, StoryExample } from './types';

const renderExample = (example: StoryExample): HTMLElement => {
	const article = document.createElement('article');
	article.className = 'alt-story-example';
	article.dataset.storyExample = example.title;
	article.dataset.wide = String(Boolean(example.wide));

	const header = document.createElement('header');
	header.className = 'alt-story-example__header';
	const heading = document.createElement('h3');
	heading.textContent = example.title;
	header.append(heading);

	if (example.description) {
		const description = document.createElement('p');
		description.textContent = example.description;
		header.append(description);
	}

	const preview = document.createElement('div');
	preview.className = 'alt-story-example__preview';
	preview.innerHTML = example.markup.trim();

	const details = document.createElement('details');
	const summary = document.createElement('summary');
	summary.textContent = 'View markup';
	const code = document.createElement('code');
	code.textContent = example.markup.trim();
	const pre = document.createElement('pre');
	pre.append(code);
	details.append(summary, pre);
	article.append(header, preview, details);
	return article;
};

export const renderStory = (story: StoryDefinition): HTMLElement => {
	const section = document.createElement('section');
	section.className = 'alt-story';
	section.id = story.id;
	section.dataset.search = `${story.title} ${story.summary} ${story.group}`.toLowerCase();

	const heading = document.createElement('header');
	heading.className = 'alt-story__heading';
	const tag = document.createElement('span');
	tag.className = 'alt-story__tag';
	tag.textContent = story.group;
	const title = document.createElement('h2');
	title.textContent = story.title;
	const summary = document.createElement('p');
	summary.textContent = story.summary;
	heading.append(tag, title, summary);

	const examples = document.createElement('div');
	examples.className = 'alt-story__examples';
	examples.append(...story.examples.map(renderExample));
	section.append(heading, examples);
	return section;
};
