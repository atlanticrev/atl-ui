export const popupObservedAttributes = [
	'anchor-id',
	'close-on-escape',
	'close-on-outside-click',
	'flip',
	'gap',
	'open',
	'placement',
];

export const popupUpgradeProperties = [
	'anchor',
	'closeOnEscape',
	'closeOnOutsideClick',
	'flip',
	'gap',
	'open',
	'placement',
];

export const readPopupBoolean = (element: HTMLElement, name: string, fallback: boolean): boolean => {
	if (!element.hasAttribute(name)) return fallback;
	return element.getAttribute(name) !== 'false';
};
