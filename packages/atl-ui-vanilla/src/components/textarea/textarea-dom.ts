import { ensureTextareaOutlineDom } from './textarea-outline-dom';

export type TextareaDom = {
	content: HTMLSpanElement;
	counter: HTMLSpanElement;
	description: HTMLSpanElement;
	field: HTMLTextAreaElement;
	footer: HTMLDivElement;
	helper: HTMLSpanElement;
	label: HTMLSpanElement;
	outline: SVGSVGElement;
	outlinePath: SVGPathElement;
	root: HTMLLabelElement;
};

let textareaId = 0;

const readTextareaDom = (host: HTMLElement): TextareaDom | undefined => {
	const root = host.querySelector<HTMLLabelElement>(':scope > [data-alt-owned="textarea"]');

	const footer = host.querySelector<HTMLDivElement>(':scope > .alt-textarea__footer');

	const content = root?.querySelector<HTMLSpanElement>('.alt-textarea__content');

	const label = root?.querySelector<HTMLSpanElement>('.alt-textarea__label');

	const field = content?.querySelector<HTMLTextAreaElement>('.alt-textarea__field');

	const description = content?.querySelector<HTMLSpanElement>('.alt-textarea__description');

	const helper = footer?.querySelector<HTMLSpanElement>('.alt-textarea__helper');

	const counter = footer?.querySelector<HTMLSpanElement>('.alt-textarea__counter');

	if (!root || !footer || !content || !label || !field || !description || !helper || !counter) {
		return undefined;
	}

	return {
		content,
		counter,
		description,
		field,
		footer,
		helper,
		label,
		...ensureTextareaOutlineDom(root),
		root,
	};
};

const ensureTextareaIds = (host: HTMLElement, dom: TextareaDom): void => {
	const id = dom.field.id || (host.id ? `${host.id}-field` : `alt-textarea-field-${++textareaId}`);

	dom.field.id = id;

	dom.label.id ||= `${id}-label`;

	dom.description.id ||= `${id}-description`;

	dom.helper.id ||= `${id}-helper`;
};

const createPart = <T extends keyof HTMLElementTagNameMap>(
	document: Document,
	tagName: T,
	part: string,
): HTMLElementTagNameMap[T] => {
	const element = document.createElement(tagName);

	element.className = `alt-textarea__${part}`;

	return element;
};

export const createTextareaDom = (host: HTMLElement): TextareaDom => {
	const hydrated = readTextareaDom(host);

	if (hydrated) {
		ensureTextareaIds(host, hydrated);

		return hydrated;
	}

	const document = host.ownerDocument;

	const root = createPart(document, 'label', 'root');

	const label = createPart(document, 'span', 'label');

	const content = createPart(document, 'span', 'content');

	const field = createPart(document, 'textarea', 'field');

	const description = createPart(document, 'span', 'description');

	const footer = createPart(document, 'div', 'footer');

	const helper = createPart(document, 'span', 'helper');

	const counter = createPart(document, 'span', 'counter');

	root.dataset.altOwned = 'textarea';

	content.append(field, description);

	root.append(label, content);

	const outline = ensureTextareaOutlineDom(root);

	footer.append(helper, counter);

	host.replaceChildren(root, footer);

	const dom = {
		content,
		counter,
		description,
		field,
		footer,
		helper,
		label,
		...outline,
		root,
	};

	ensureTextareaIds(host, dom);

	return dom;
};
