import { booleanAttributeConverter } from '../../core';

const DEFAULT_DURATION = 5_000;
const DEFAULT_MAX = 3;

const readNumber = (element: HTMLElement, name: string, fallback: number, minimum: number): number => {
	const attribute = element.getAttribute(name);
	if (attribute === null || attribute.trim() === '') return fallback;
	const value = Number(attribute);
	return Number.isFinite(value) && value >= minimum ? Math.floor(value) : fallback;
};

export const readDefaultDuration = (element: HTMLElement): number => {
	return readNumber(element, 'default-duration', DEFAULT_DURATION, 0);
};

export const readMaxToasts = (element: HTMLElement): number => {
	return readNumber(element, 'max', DEFAULT_MAX, 1);
};

export const readPreventDuplicate = (element: HTMLElement): boolean => {
	return booleanAttributeConverter.fromAttribute(element.getAttribute('prevent-duplicate'));
};

export const writePreventDuplicate = (element: HTMLElement, value: boolean): void => {
	const attribute = booleanAttributeConverter.toAttribute(value);
	if (attribute === null) element.removeAttribute('prevent-duplicate');
	else element.setAttribute('prevent-duplicate', attribute);
};
