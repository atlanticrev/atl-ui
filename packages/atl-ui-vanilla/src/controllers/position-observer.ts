import type { OverlayPosition, OverlayPositionOptions } from './position';
import { measureOverlayPosition } from './position';

type ResizeObserverConstructor = new (callback: ResizeObserverCallback) => ResizeObserver;

export type OverlayPositionBindingOptions = OverlayPositionOptions & {
	anchor: Element;
	onPosition: (position: OverlayPosition) => void;
	overlay: Element;
	resizeObserver?: ResizeObserverConstructor;
	signal?: AbortSignal;
};

const getResizeObserver = (view: Window | null): ResizeObserverConstructor | undefined => {
	return (view as (Window & { ResizeObserver?: ResizeObserverConstructor }) | null)?.ResizeObserver;
};

export const bindOverlayPosition = (options: OverlayPositionBindingOptions): (() => void) => {
	if (options.signal?.aborted) {
		return (): void => undefined;
	}

	const ownerDocument = options.anchor.ownerDocument;
	const view = ownerDocument.defaultView;
	const update = (): void => {
		options.onPosition(measureOverlayPosition(options.anchor, options.overlay, options));
	};
	const Observer = options.resizeObserver ?? getResizeObserver(view);
	const observer = Observer ? new Observer(update) : null;
	let active = true;
	const cleanup = (): void => {
		if (!active) {
			return;
		}

		active = false;
		view?.removeEventListener('resize', update);
		ownerDocument.removeEventListener('scroll', update, true);
		observer?.disconnect();
		options.signal?.removeEventListener('abort', cleanup);
	};

	view?.addEventListener('resize', update);
	ownerDocument.addEventListener('scroll', update, true);
	observer?.observe(options.anchor);
	observer?.observe(options.overlay);
	options.signal?.addEventListener('abort', cleanup, {
		once: true,
	});
	update();
	return cleanup;
};
