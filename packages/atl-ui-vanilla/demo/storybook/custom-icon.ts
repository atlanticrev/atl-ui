const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const CUSTOM_SPARK_PATH = 'M12 2.8 14.3 9.7 21.2 12l-6.9 2.3L12 21.2l-2.3-6.9L2.8 12l6.9-2.3L12 2.8Z';

export const customIconMarkup = `
<svg
	aria-hidden="true"
	class="alt-icon"
	data-story-custom-icon="spark"
	fill="none"
	focusable="false"
	height="20"
	viewBox="0 0 24 24"
	width="20"
>
	<path
		d="${CUSTOM_SPARK_PATH}"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
	></path>
</svg>`;

export const createCustomIcon = (document: Document): SVGSVGElement => {
	const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

	const path = document.createElementNS(SVG_NAMESPACE, 'path');

	svg.classList.add('alt-icon');

	svg.dataset.storyCustomIcon = 'spark';

	svg.setAttribute('aria-hidden', 'true');

	svg.setAttribute('fill', 'none');

	svg.setAttribute('focusable', 'false');

	svg.setAttribute('height', '20');

	svg.setAttribute('viewBox', '0 0 24 24');

	svg.setAttribute('width', '20');

	path.setAttribute('d', CUSTOM_SPARK_PATH);

	path.setAttribute('stroke', 'currentColor');

	path.setAttribute('stroke-linecap', 'round');

	path.setAttribute('stroke-linejoin', 'round');

	path.setAttribute('stroke-width', '1.5');

	svg.append(path);

	return svg;
};
