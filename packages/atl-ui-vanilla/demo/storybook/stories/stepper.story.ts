import { example, defineStory } from '../story-factory';

export const stepperStory = defineStory({
	id: 'stepper',
	title: 'Stepper',
	group: 'Native CSS',
	summary: 'Responsive ordered progress steps with current and completed states.',
	examples: [
		example(
			'Campaign setup',
			`<ol class="alt-stepper" aria-label="Campaign setup progress">
	<li class="alt-stepper__step" data-status="complete">Details</li>
	<li class="alt-stepper__step" aria-current="step">Audience</li>
	<li class="alt-stepper__step">Schedule</li>
	<li class="alt-stepper__step">Review</li>
</ol>`,
			undefined,
			true,
		),
	],
});
