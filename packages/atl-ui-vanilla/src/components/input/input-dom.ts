export type InputDom = {
	content: HTMLSpanElement;
	counter: HTMLSpanElement;
	description: HTMLSpanElement;
	field: HTMLInputElement;
	footer: HTMLDivElement;
	helper: HTMLSpanElement;
	label: HTMLSpanElement;
	leading: HTMLSpanElement;
	root: HTMLLabelElement;
	trailing: HTMLSpanElement;
};

let inputId = 0;

const readInputDom = (host: HTMLElement): InputDom | undefined => {
	const root = host.querySelector<HTMLLabelElement>(':scope > [data-alt-owned="input"]');
	const footer = host.querySelector<HTMLDivElement>(':scope > .alt-input__footer');
	const find = <T extends HTMLElement>(selector: string): T | null => root?.querySelector<T>(selector) ?? null;
	const label = find<HTMLSpanElement>('.alt-input__label');
	const icons = root?.querySelectorAll<HTMLSpanElement>('.alt-input__icon');
	const content = find<HTMLSpanElement>('.alt-input__content');
	const field = find<HTMLInputElement>('.alt-input__field');
	const description = find<HTMLSpanElement>('.alt-input__description');
	const helper = footer?.querySelector<HTMLSpanElement>('.alt-input__helper');
	const counter = footer?.querySelector<HTMLSpanElement>('.alt-input__counter');

	if (!root || !footer || !label || !icons?.[0] || !content || !field || !description || !icons[1]) {
		return undefined;
	}

	if (!helper || !counter) {
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
		leading: icons[0],
		root,
		trailing: icons[1],
	};
};

const ensureInputIds = (host: HTMLElement, dom: InputDom): void => {
	const id = dom.field.id || (host.id ? `${host.id}-field` : `alt-input-field-${++inputId}`);
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
	element.className = `alt-input__${part}`;
	return element;
};

export const createInputDom = (host: HTMLElement): InputDom => {
	const hydrated = readInputDom(host);

	if (hydrated) {
		ensureInputIds(host, hydrated);
		return hydrated;
	}

	const document = host.ownerDocument;
	const root = createPart(document, 'label', 'root');
	const label = createPart(document, 'span', 'label');
	const leading = createPart(document, 'span', 'icon');
	const content = createPart(document, 'span', 'content');
	const field = createPart(document, 'input', 'field');
	const description = createPart(document, 'span', 'description');
	const trailing = createPart(document, 'span', 'icon');
	const footer = createPart(document, 'div', 'footer');
	const helper = createPart(document, 'span', 'helper');
	const counter = createPart(document, 'span', 'counter');

	root.dataset.altOwned = 'input';
	leading.dataset.position = 'leading';
	trailing.dataset.position = 'trailing';
	content.append(field, description);
	root.append(label, leading, content, trailing);
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
		leading,
		root,
		trailing,
	};
	ensureInputIds(host, dom);
	return dom;
};
