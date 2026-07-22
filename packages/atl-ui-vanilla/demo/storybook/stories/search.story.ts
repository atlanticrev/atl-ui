import { example, defineStory } from '../story-factory';

export const searchStory = defineStory({
	id: 'search',
	title: 'Search',
	group: 'Complex',
	summary: 'Native search semantics with form participation and an accessible clear action.',
	examples: [
		example('Default', '<alt-search name="query" placeholder="Search campaigns"></alt-search>'),
		example('With value', '<alt-search aria-label="Search publications" value="quarterly"></alt-search>'),
		example('Disabled', '<alt-search disabled value="Archived campaign"></alt-search>'),
	],
});
