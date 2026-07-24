import {
	bindFieldOutline,
	calculateFieldNotch,
	type FieldNotchGeometry,
	syncFieldOutline,
} from '../field-outline/field-outline';

import type { TextareaDom } from './textarea-dom';

export type TextareaNotchGeometry = FieldNotchGeometry;

type TextareaNotchOptions = {
	direction: 'ltr' | 'rtl';
	fieldLeft: number;
	fieldRight: number;
	floatingPadding: number;
	labelWidth: number;
	rootClientLeft: number;
	rootLeft: number;
};

export const calculateTextareaNotch = (options: TextareaNotchOptions): TextareaNotchGeometry => {
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

const createBinding = (host: HTMLElement, dom: TextareaDom) => ({
	getFloating: (): boolean => true,
	host,
	label: dom.label,
	outline: dom.outline,
	outlinePath: dom.outlinePath,
	root: dom.root,
	text: dom.field,
});

export const syncTextareaOutline = (host: HTMLElement, dom: TextareaDom): void => {
	syncFieldOutline(createBinding(host, dom));
};

export const bindTextareaOutline = (host: HTMLElement, dom: TextareaDom, signal: AbortSignal): (() => void) => {
	return bindFieldOutline(createBinding(host, dom), signal);
};
