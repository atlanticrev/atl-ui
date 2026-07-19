export type ElementEnvironment = {
	customElements: CustomElementRegistry;
	htmlElement: typeof HTMLElement;
};

export type ElementClassFactory = (HtmlElementConstructor: typeof HTMLElement) => CustomElementConstructor;

const resolveElementEnvironment = (): ElementEnvironment | undefined => {
	const environment = globalThis as typeof globalThis & Partial<ElementEnvironment>;

	if (!environment.customElements || typeof environment.HTMLElement !== 'function') {
		return undefined;
	}

	return {
		customElements: environment.customElements,
		htmlElement: environment.HTMLElement,
	};
};

export const registerElement = (
	tagName: string,
	createElementClass: ElementClassFactory,
	environment: ElementEnvironment | undefined = resolveElementEnvironment(),
): CustomElementConstructor | undefined => {
	if (!environment) {
		return undefined;
	}

	const registeredElement = environment.customElements.get(tagName);

	if (registeredElement) {
		return registeredElement;
	}

	const ElementClass = createElementClass(environment.htmlElement);
	environment.customElements.define(tagName, ElementClass);

	return ElementClass;
};
