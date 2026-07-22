import type { FileUploadDom } from './file-upload-dom';

const buttonIcons = new WeakMap<HTMLElement, Node | null>();

export const defineFileUploadIconProperty = (target: typeof HTMLElement.prototype): void => {
	Object.defineProperty(target, 'buttonIcon', {
		configurable: true,
		get(this: HTMLElement): Node | null {
			return buttonIcons.get(this) ?? null;
		},
		set(this: HTMLElement, value: Node | null): void {
			buttonIcons.set(this, value);

			(this as HTMLElement & { requestUpdate: () => void }).requestUpdate();
		},
	});
};

export const syncFileUploadIcon = (host: HTMLElement, dom: FileUploadDom): void => {
	const icon = buttonIcons.get(host) ?? null;

	dom.buttonIcon.hidden = !icon;

	if (icon && dom.buttonIcon.firstChild !== icon) dom.buttonIcon.replaceChildren(icon);

	if (!icon && dom.buttonIcon.childNodes.length > 0) dom.buttonIcon.replaceChildren();
};
