export const findElement = <ElementType extends Element>(
	root: ParentNode,
	selector: string,
): ElementType => {
	const element = root.querySelector<ElementType>(selector);

	if (!element) {
		throw new Error(`Storybook element not found: ${selector}`);
	}

	return element;
};

export const findElements = <ElementType extends Element>(
	root: ParentNode,
	selector: string,
): ElementType[] => Array.from(root.querySelectorAll<ElementType>(selector));
