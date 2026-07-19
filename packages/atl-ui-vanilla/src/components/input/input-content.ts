import type { InputDom } from './input-dom';

export type InputContent = {
	description: string;
	helperText: string;
	label: string;
	showCharacterCount: boolean;
};

export const syncInputContent = (host: HTMLElement, dom: InputDom, content: InputContent): void => {
	dom.label.textContent = content.label;
	dom.label.hidden = content.label.length === 0;
	dom.description.textContent = content.description;
	dom.description.hidden = content.description.length === 0;
	dom.helper.textContent = content.helperText;
	dom.helper.hidden = content.helperText.length === 0;
	dom.counter.hidden = !content.showCharacterCount;
	dom.counter.textContent = `${dom.field.value.length}/${dom.field.maxLength}`;
	dom.footer.hidden = dom.helper.hidden && dom.counter.hidden;
	host.dataset.filled = String(dom.field.value.length > 0);
	host.dataset.hasLeadingIcon = String(dom.leading.childNodes.length > 0);
};

export const replaceInputAccessory = (container: HTMLElement, node: Node | null): void => {
	container.replaceChildren();
	container.hidden = node === null;

	if (node) {
		container.append(node);
	}
};
