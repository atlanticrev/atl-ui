const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export type FieldOutlineDom = {
	outline: SVGSVGElement;
	outlinePath: SVGPathElement;
};

export type FieldOutlineClassNames = {
	outline: string;
	path: string;
};

const findOutlineDom = (root: HTMLElement, classes: FieldOutlineClassNames): FieldOutlineDom | undefined => {
	const outline = root.querySelector<SVGSVGElement>(`:scope > .${classes.outline}`);

	const outlinePath = outline?.querySelector<SVGPathElement>(`:scope > .${classes.path}`);

	return outline && outlinePath ? { outline, outlinePath } : undefined;
};

export const ensureFieldOutlineDom = (root: HTMLElement, classes: FieldOutlineClassNames): FieldOutlineDom => {
	const existing = findOutlineDom(root, classes);

	if (existing) return existing;

	const document = root.ownerDocument;

	const outline = document.createElementNS(SVG_NAMESPACE, 'svg');

	const outlinePath = document.createElementNS(SVG_NAMESPACE, 'path');

	outline.classList.add(classes.outline);

	outline.setAttribute('aria-hidden', 'true');

	outline.setAttribute('focusable', 'false');

	outlinePath.classList.add(classes.path);

	outline.append(outlinePath);

	root.append(outline);

	return { outline, outlinePath };
};
