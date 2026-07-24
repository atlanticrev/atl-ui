import type { TextareaDom } from './textarea-dom';

export type TextareaContent = {
	description: string;
	helperText: string;
	label: string;
	showCharacterCount: boolean;
};

export const syncTextareaContent = (host: HTMLElement, dom: TextareaDom, content: TextareaContent): void => {
	dom.label.textContent = content.label;

	dom.label.hidden = content.label.length === 0;

	dom.description.textContent = content.description;

	dom.description.hidden = content.description.length === 0;

	dom.helper.textContent = content.helperText;

	dom.helper.hidden = content.helperText.length === 0;

	dom.counter.hidden = !content.showCharacterCount;

	dom.counter.textContent =
		dom.field.maxLength >= 0 ? `${dom.field.value.length}/${dom.field.maxLength}` : String(dom.field.value.length);

	dom.footer.hidden = dom.helper.hidden && dom.counter.hidden;

	host.dataset.filled = String(dom.field.value.length > 0);
};
