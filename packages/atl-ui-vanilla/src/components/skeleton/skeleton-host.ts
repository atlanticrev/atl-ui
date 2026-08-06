const HOST_CLASS = 'alt-skeleton-host';
const CONTENT_SELECTOR = ':scope > .alt-skeleton-host__content';

export const setAltSkeletonHostLoading = (host: HTMLElement, loading: boolean): void => {
	if (!host.classList.contains(HOST_CLASS)) {
		throw new TypeError(`Skeleton host must have the ${HOST_CLASS} class.`);
	}

	const contentRoots = host.querySelectorAll<HTMLElement>(CONTENT_SELECTOR);

	if (contentRoots.length !== 1) {
		throw new TypeError(`Skeleton host must contain exactly one direct ${CONTENT_SELECTOR} element.`);
	}

	const content = contentRoots[0];

	host.setAttribute('aria-busy', String(loading));

	content.toggleAttribute('inert', loading);

	if (loading) content.setAttribute('aria-hidden', 'true');
	else content.removeAttribute('aria-hidden');
};
