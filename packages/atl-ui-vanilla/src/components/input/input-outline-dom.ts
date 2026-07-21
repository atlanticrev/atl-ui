import {
	ensureFieldOutlineDom,
	type FieldOutlineDom,
} from '../field-outline/field-outline-dom';

export type InputOutlineDom = FieldOutlineDom;

export const ensureInputOutlineDom = (root: HTMLElement): InputOutlineDom => {
	return ensureFieldOutlineDom(root, {
		outline: 'alt-input__outline',
		path: 'alt-input__outline-path',
	});
};
