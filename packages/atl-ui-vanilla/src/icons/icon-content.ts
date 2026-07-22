import { setAltIcon } from './create-icon';
import type { AltIconName, AltIconOptions } from './types';

export type AltReplaceableIcon = Node | null | undefined;

export const syncAltIconContent = (
	container: Element,
	content: AltReplaceableIcon,
	fallback: AltIconName,
	options: AltIconOptions = {},
): void => {
	if (content === null) {
		if (container.childNodes.length > 0) container.replaceChildren();

		return;
	}

	if (content) {
		if (container.firstChild !== content || container.childNodes.length !== 1) {
			container.replaceChildren(content);
		}

		return;
	}

	setAltIcon(container, fallback, options);
};
