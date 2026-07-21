import { ALT_ICON_DEFINITIONS } from './icon-data';
import type { AltIconName, AltIconOptions } from './types';

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const DEFAULT_ICON_SIZE = 20;

const normalizeSize = (size: number | undefined): number => {
	if (!Number.isFinite(size) || Number(size) <= 0) return DEFAULT_ICON_SIZE;
	return Number(size);
};

export const createAltIcon = (
	document: Document,
	name: AltIconName,
	options: AltIconOptions = {},
): SVGSVGElement => {
	const definition = ALT_ICON_DEFINITIONS[name];
	const size = normalizeSize(options.size);
	const svg = document.createElementNS(SVG_NAMESPACE, 'svg');
	svg.classList.add('alt-icon');
	if (options.className) svg.classList.add(options.className);
	svg.dataset.altIcon = name;
	svg.setAttribute('aria-hidden', 'true');
	svg.setAttribute('focusable', 'false');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('height', String(size));
	svg.setAttribute('viewBox', definition.viewBox);
	svg.setAttribute('width', String(size));

	for (const pathData of definition.paths) {
		const path = document.createElementNS(SVG_NAMESPACE, 'path');
		path.setAttribute('d', pathData);
		path.setAttribute('stroke', 'currentColor');
		path.setAttribute('stroke-linecap', 'round');
		path.setAttribute('stroke-linejoin', 'round');
		path.setAttribute('stroke-width', '1.5');
		svg.append(path);
	}

	return svg;
};

export const setAltIcon = (
	container: Element,
	name: AltIconName,
	options: AltIconOptions = {},
): void => {
	const current = container.firstElementChild as SVGElement | null;
	if (current?.dataset.altIcon === name) return;
	container.replaceChildren(createAltIcon(container.ownerDocument, name, options));
};
