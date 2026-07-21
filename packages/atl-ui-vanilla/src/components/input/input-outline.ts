import {
	bindFieldOutline,
	calculateFieldNotch,
	type FieldNotchGeometry,
	syncFieldOutline,
} from '../field-outline/field-outline';

import type { InputDom } from './input-dom';

export type InputNotchGeometry = FieldNotchGeometry;

type InputNotchOptions = {
	direction: 'ltr' | 'rtl';
	fieldLeft: number;
	fieldRight: number;
	floatingPadding: number;
	labelWidth: number;
	rootClientLeft: number;
	rootLeft: number;
};

export const calculateInputNotch = (options: InputNotchOptions): InputNotchGeometry => {
	return calculateFieldNotch({
		direction: options.direction,
		floatingPadding: options.floatingPadding,
		labelWidth: options.labelWidth,
		rootClientLeft: options.rootClientLeft,
		rootLeft: options.rootLeft,
		textLeft: options.fieldLeft,
		textRight: options.fieldRight,
	});
};

const createBinding = (host: HTMLElement, dom: InputDom) => ({
	getFloating: (): boolean => host.dataset.labelFloat === 'true' || dom.root.matches(':focus-within'),
	host,
	label: dom.label,
	outline: dom.outline,
	outlinePath: dom.outlinePath,
	root: dom.root,
	text: dom.field,
});

export const syncInputOutline = (host: HTMLElement, dom: InputDom): void => {
	syncFieldOutline(createBinding(host, dom));
};

export const bindInputOutline = (host: HTMLElement, dom: InputDom, signal: AbortSignal): (() => void) => {
	return bindFieldOutline(createBinding(host, dom), signal);
};
