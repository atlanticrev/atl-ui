export type OverlayDismissReason = 'escape' | 'outside-pointer';

export type OverlayDismissDetail = {
	event: KeyboardEvent | PointerEvent;
	reason: OverlayDismissReason;
};

export type OverlayDismissOptions = {
	ignore?: readonly Element[];
	onDismiss: (detail: OverlayDismissDetail) => void;
	overlay: Element;
	signal?: AbortSignal;
};

const isInside = (event: Event, element: Element): boolean => {
	if (event.composedPath().includes(element)) {
		return true;
	}

	const view = element.ownerDocument.defaultView;
	return Boolean(view && event.target instanceof view.Node && element.contains(event.target));
};

export const bindOverlayDismiss = (options: OverlayDismissOptions): (() => void) => {
	if (options.signal?.aborted) {
		return (): void => undefined;
	}

	const ownerDocument = options.overlay.ownerDocument;
	const onKeyDown = (event: KeyboardEvent): void => {
		if (event.key === 'Escape' && !event.defaultPrevented && !event.isComposing) {
			options.onDismiss({
				event,
				reason: 'escape',
			});
		}
	};
	const onPointerDown = (event: PointerEvent): void => {
		const boundaries = [options.overlay, ...(options.ignore ?? [])];

		if (!event.defaultPrevented && !boundaries.some((element) => isInside(event, element))) {
			options.onDismiss({
				event,
				reason: 'outside-pointer',
			});
		}
	};
	let active = true;
	const cleanup = (): void => {
		if (!active) {
			return;
		}

		active = false;
		ownerDocument.removeEventListener('keydown', onKeyDown);
		ownerDocument.removeEventListener('pointerdown', onPointerDown, true);
		options.signal?.removeEventListener('abort', cleanup);
	};

	ownerDocument.addEventListener('keydown', onKeyDown);
	ownerDocument.addEventListener('pointerdown', onPointerDown, true);
	options.signal?.addEventListener('abort', cleanup, {
		once: true,
	});
	return cleanup;
};
