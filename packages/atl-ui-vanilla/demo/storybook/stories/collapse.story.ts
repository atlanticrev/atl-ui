import { example, defineStory } from '../story-factory';

const collapse = (single = false): string => `
<alt-collapse ${single ? 'single' : ''}>
	<details data-key="audience" open><summary>Audience</summary><p>Channel and follower breakdown.</p></details>
	<details data-key="schedule"><summary>Schedule</summary><p>Publication dates and time zones.</p></details>
	<details data-key="delivery"><summary>Delivery</summary><p>Export and notification settings.</p></details>
</alt-collapse>`;

export const collapseStory = defineStory({
	id: 'collapse',
	title: 'Collapse',
	group: 'Behavioral',
	summary: 'Progressive enhancement for native details, with optional accordion behavior.',
	examples: [
		example('Multiple panels', collapse(), 'Native details remain usable before registration.', true),
		example('Single panel', collapse(true), 'Opening one panel closes its sibling.', true),
	],
});
