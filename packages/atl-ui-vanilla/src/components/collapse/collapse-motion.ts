const COLLAPSE_DURATION = 200;

const prefersReducedMotion = (item: HTMLElement): boolean => {
	const view = item.ownerDocument.defaultView;

	return view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
};

export const createCollapseMotion = (
	item: HTMLDetailsElement,
	open: boolean,
	startHeight: number,
): Animation | undefined => {
	const summary = item.querySelector<HTMLElement>(':scope > summary');

	if (!summary || prefersReducedMotion(item) || typeof item.animate !== 'function') return undefined;

	if (open) item.open = true;

	const endHeight = open ? item.scrollHeight : summary.getBoundingClientRect().height;

	if (Math.abs(startHeight - endHeight) < 1) return undefined;

	item.dataset.altCollapseAnimating = 'true';

	return item.animate([{ height: `${startHeight}px` }, { height: `${endHeight}px` }], {
		duration: COLLAPSE_DURATION,
		easing: 'ease',
		fill: 'both',
	});
};
