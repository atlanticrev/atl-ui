import type { FieldOutlineDom } from './field-outline-dom';
import { buildFieldOutlinePath } from './field-outline-path';

type ResizeObserverConstructor = new (callback: ResizeObserverCallback) => ResizeObserver;
type MutationObserverConstructor = new (callback: MutationCallback) => MutationObserver;
type OutlineWindow = Window & {
	MutationObserver?: MutationObserverConstructor;
	ResizeObserver?: ResizeObserverConstructor;
};

export type FieldNotchGeometry = { labelLeft: number; start: number; width: number };

export type FieldOutlineBinding = FieldOutlineDom & {
	getFloating: () => boolean;
	host: HTMLElement;
	label: HTMLElement;
	root: HTMLElement;
	text: HTMLElement;
};

type FieldNotchOptions = {
	direction: 'ltr' | 'rtl';
	floatingPadding: number;
	labelWidth: number;
	rootClientLeft: number;
	rootLeft: number;
	textLeft: number;
	textRight: number;
};

const readPixels = (value: string): number => Number.parseFloat(value) || 0;

export const calculateFieldNotch = (options: FieldNotchOptions): FieldNotchGeometry => {
	const textStart = options.direction === 'rtl'
		? options.textRight - options.rootLeft
		: options.textLeft - options.rootLeft;
	const labelLeft = options.direction === 'rtl'
		? textStart - options.labelWidth + options.floatingPadding
		: textStart - options.floatingPadding;
	const start = Math.max(labelLeft, 0);
	return {
		labelLeft: Math.max(start - options.rootClientLeft, 0),
		start,
		width: options.labelWidth,
	};
};

export const syncFieldOutline = (binding: FieldOutlineBinding): void => {
	const view = binding.host.ownerDocument.defaultView;
	if (!view) return;
	const rootRect = binding.root.getBoundingClientRect();
	const textRect = binding.text.getBoundingClientRect();
	const labelRect = binding.label.getBoundingClientRect();
	const rootStyles = view.getComputedStyle(binding.root);
	const labelStyles = view.getComputedStyle(binding.label);
	const pathStyles = view.getComputedStyle(binding.outlinePath);
	const floating = !binding.label.hidden && binding.getFloating();
	const floatingPadding = readPixels(labelStyles.paddingLeft);
	const strokeWidth = readPixels(pathStyles.strokeWidth) || readPixels(rootStyles.borderTopWidth) || 1;
	const notch = calculateFieldNotch({
		direction: rootStyles.direction === 'rtl' ? 'rtl' : 'ltr',
		floatingPadding,
		labelWidth: floating ? labelRect.width : 0,
		rootClientLeft: binding.root.clientLeft,
		rootLeft: rootRect.left,
		textLeft: textRect.left,
		textRight: textRect.right,
	});
	binding.label.style.left = floating ? `${notch.labelLeft}px` : '';
	binding.outline.setAttribute('viewBox', `0 0 ${rootRect.width} ${rootRect.height}`);
	binding.outline.setAttribute('width', String(rootRect.width));
	binding.outline.setAttribute('height', String(rootRect.height));
	binding.outlinePath.setAttribute('d', buildFieldOutlinePath({
		height: rootRect.height,
		notchStart: floating ? notch.start : 0,
		notchWidth: floating ? notch.width : 0,
		radius: readPixels(rootStyles.borderTopLeftRadius),
		strokeWidth,
		width: rootRect.width,
	}));
};

export const bindFieldOutline = (binding: FieldOutlineBinding, signal: AbortSignal): (() => void) => {
	const sync = (): void => syncFieldOutline(binding);
	const schedule = (): void => queueMicrotask(sync);
	const view = binding.host.ownerDocument.defaultView as OutlineWindow | null;
	const resizeObserver = view?.ResizeObserver ? new view.ResizeObserver(sync) : null;
	const mutationObserver = view?.MutationObserver ? new view.MutationObserver(schedule) : null;
	binding.root.addEventListener('focusin', schedule, { signal });
	binding.root.addEventListener('focusout', schedule, { signal });
	resizeObserver?.observe(binding.root);
	resizeObserver?.observe(binding.label);
	resizeObserver?.observe(binding.text);
	mutationObserver?.observe(binding.host, { attributes: true });
	signal.addEventListener('abort', () => {
		resizeObserver?.disconnect();
		mutationObserver?.disconnect();
	}, { once: true });
	sync();
	return sync;
};
