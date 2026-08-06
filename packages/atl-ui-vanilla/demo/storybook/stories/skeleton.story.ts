import { setAltSkeletonHostLoading } from '../../../src';
import { findElement } from '../dom';
import { defineStory, example } from '../story-factory';

const contentBackedHost = `
<div class="alt-catalog-story-stack" data-skeleton-host-example>
	<article
		aria-busy="true"
		class="alt-card alt-skeleton-host"
		data-skeleton-host
		style="--alt-card-radius: 24px; --alt-skeleton-bg: #e8edf3; width: 100%"
	>
		<div aria-hidden="true" class="alt-skeleton-host__content" inert>
			<h4>Scheduled publication</h4>
			<p>The real widget stays mounted and supplies the loading geometry.</p>
			<button class="alt-button" data-variant="outlined" type="button">Review publication</button>
		</div>
	</article>
	<button class="alt-button" data-skeleton-toggle data-variant="tonal" type="button">Show content</button>
</div>`;

export const skeletonStory = defineStory({
	id: 'skeleton',
	title: 'Skeleton',
	group: 'Native CSS',
	summary: 'Loading placeholders and content-backed hosts with stable geometry, inherited radius and fade-out.',
	examples: [
		example(
			'Content-backed host',
			contentBackedHost,
			'Real content determines the box. Radius, colors, shimmer speed and fade timing use CSS variables.',
			true,
		),
		example(
			'Shapes',
			`
<div class="alt-catalog-story-stack">
	<span class="alt-skeleton" data-shape="line" style="width: 16rem">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 10rem">&nbsp;</span>
	<span class="alt-skeleton" data-shape="circle" style="width: 48px">&nbsp;</span>
	<span class="alt-skeleton" style="width: 100%; height: 72px">&nbsp;</span>
</div>`,
		),
		example(
			'Repeated list',
			`
<div class="alt-skeleton-repeat" style="--alt-skeleton-repeat-gap: 0.75rem; width: 100%">
	<span class="alt-skeleton" data-shape="line" style="width: 100%">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 86%">&nbsp;</span>
	<span class="alt-skeleton" data-shape="line" style="width: 72%">&nbsp;</span>
</div>`,
		),
		example(
			'Overlay composition',
			`
<div class="alt-skeleton-wrapper alt-card" style="width: 100%; min-height: 120px">
	<div class="alt-skeleton-wrapper__placeholder">Loaded card content</div>
	<span class="alt-skeleton" data-shape="overlay">&nbsp;</span>
</div>`,
			undefined,
			true,
		),
		example(
			'Narrow responsive placeholder',
			`
<div class="alt-catalog-stress-frame" data-width="narrow">
	<div class="alt-skeleton-repeat" style="width: 100%">
		<span class="alt-skeleton" data-shape="line" style="width: 100%">&nbsp;</span>
		<span class="alt-skeleton" data-shape="line" style="width: 72%">&nbsp;</span>
	</div>
</div>`,
			'Skeleton animation stays clipped to its own geometry.',
		),
	],
	setup: (root) => {
		const host = findElement<HTMLElement>(root, '[data-skeleton-host]');

		const toggle = findElement<HTMLButtonElement>(root, '[data-skeleton-toggle]');

		const handleLoadingToggle = (): void => {
			const loading = host.getAttribute('aria-busy') === 'true';

			setAltSkeletonHostLoading(host, !loading);

			toggle.textContent = loading ? 'Show skeleton' : 'Show content';
		};

		setAltSkeletonHostLoading(host, true);

		toggle.addEventListener('click', handleLoadingToggle);
	},
});
