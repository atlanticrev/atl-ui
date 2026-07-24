import { ensureFieldOutlineDom, type FieldOutlineDom } from '../field-outline/field-outline-dom';

export type TextareaOutlineDom = FieldOutlineDom;

export const ensureTextareaOutlineDom = (root: HTMLElement): TextareaOutlineDom => {
	return ensureFieldOutlineDom(root, {
		outline: 'alt-textarea__outline',
		path: 'alt-textarea__outline-path',
	});
};
