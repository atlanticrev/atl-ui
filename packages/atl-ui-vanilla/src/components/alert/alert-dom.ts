import { createAltIcon } from '../../icons';

export type AlertDom = {
	action: HTMLDivElement;
	authoredAction: Node | undefined;
	authoredIcon: Node | undefined;
	closeButton: HTMLButtonElement;
	icon: HTMLDivElement;
	message: HTMLDivElement;
};

const isElement = (node: Node): node is Element => node.nodeType === node.ELEMENT_NODE;

const findDirectPart = <ElementType extends Element>(host: HTMLElement, selector: string): ElementType | null => {
	return Array.from(host.children).find((child) => child.matches(selector)) as ElementType | null;
};

const createPart = (host: HTMLElement, className: string): HTMLDivElement => {
	const part = host.ownerDocument.createElement('div');

	part.className = className;

	part.dataset.altOwned = '';

	return part;
};

const createCloseButton = (host: HTMLElement): HTMLButtonElement => {
	const button = host.ownerDocument.createElement('button');

	button.className = 'alt-button alt-alert__close';

	button.dataset.altAlertClose = '';

	button.dataset.altOwned = '';

	button.dataset.elevation = 'none';

	button.dataset.iconOnly = '';

	button.dataset.size = '32';

	button.dataset.variant = 'text';

	button.type = 'button';

	button.append(createAltIcon(host.ownerDocument, 'close', { size: 16 }));

	return button;
};

export const createAlertDom = (host: HTMLElement): AlertDom => {
	const sourceNodes = Array.from(host.childNodes);

	const existingIcon = findDirectPart<HTMLDivElement>(host, '.alt-alert__icon');

	const existingMessage = findDirectPart<HTMLDivElement>(host, '.alt-alert__message');

	const existingAction = findDirectPart<HTMLDivElement>(host, '.alt-alert__action');

	const authoredIcon = sourceNodes.find((node) => isElement(node) && node.matches('[data-alt-alert-icon]'));

	const authoredAction = sourceNodes.find((node) => isElement(node) && node.matches('[data-alt-alert-action]'));

	const icon = existingIcon ?? createPart(host, 'alt-alert__icon');

	const message = existingMessage ?? createPart(host, 'alt-alert__message');

	const action = existingAction ?? createPart(host, 'alt-alert__action');

	icon.setAttribute('aria-hidden', 'true');

	if (authoredIcon && !existingIcon) icon.append(authoredIcon);

	if (!existingMessage) {
		const messageNodes = sourceNodes.filter((node) => {
			return node !== authoredIcon && node !== authoredAction && node !== existingIcon && node !== existingAction;
		});

		message.append(...messageNodes);
	}

	if (authoredAction && !existingAction) action.append(authoredAction);

	const closeButton = action.querySelector<HTMLButtonElement>('.alt-alert__close') ?? createCloseButton(host);

	if (!closeButton.isConnected) action.append(closeButton);

	host.replaceChildren(icon, message, action);

	return {
		action,
		authoredAction,
		authoredIcon,
		closeButton,
		icon,
		message,
	};
};

export const syncAlertAction = (dom: AlertDom, content: Node | null | undefined, dismissible: boolean): void => {
	const hasAction = Boolean(content);

	if (content && dom.action.firstChild !== content) dom.action.replaceChildren(content, dom.closeButton);

	if (!content && dom.action.firstChild !== dom.closeButton) dom.action.replaceChildren(dom.closeButton);

	dom.closeButton.hidden = hasAction || !dismissible;

	dom.action.hidden = !hasAction && !dismissible;
};
