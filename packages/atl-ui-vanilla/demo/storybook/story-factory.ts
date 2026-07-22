import type { StoryDefinition, StoryExample } from './types';

type StoryOptions = Omit<StoryDefinition, 'examples'> & {
	examples: readonly StoryExample[];
};

export const defineStory = (options: StoryOptions): StoryDefinition => options;

export const example = (title: string, markup: string, description?: string, wide = false): StoryExample => ({
	description,
	markup,
	title,
	wide,
});
