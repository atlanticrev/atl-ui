export const reflectBoolean = (element: Element, name: string, value: boolean): void => {
	element.toggleAttribute(name, value);
};

export const reflectString = (element: Element, name: string, value: string | null): void => {
	if (value === null) {
		element.removeAttribute(name);
		return;
	}

	element.setAttribute(name, value);
};

export const readString = (element: Element, name: string): string => element.getAttribute(name) ?? '';
