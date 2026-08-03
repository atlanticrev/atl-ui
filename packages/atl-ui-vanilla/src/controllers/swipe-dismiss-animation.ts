const MOTION_FALLBACK_BUFFER = 80;

type SwipeSettleAnimationOptions = {
	duration: number;
	durationProperty: string;
	onReady?: () => void;
	onComplete: () => void;
	onTarget: () => void;
	waitForPaint?: boolean;
};

export const animateSwipeSettle = (surface: HTMLElement, options: SwipeSettleAnimationOptions): (() => void) => {
	const view = surface.ownerDocument.defaultView;

	const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

	const duration = reducedMotion ? 0 : options.duration;

	let complete = false;

	let frame = 0;

	let targetApplied = false;

	let timeout: number | undefined;

	const applyTarget = (): void => {
		if (targetApplied) return;

		targetApplied = true;

		options.onTarget();

		if (duration === 0) queueMicrotask(finish);
	};

	const cancel = (): void => {
		if (view) {
			view.cancelAnimationFrame?.(frame);

			if (timeout !== undefined) view.clearTimeout(timeout);
		}

		surface.removeEventListener('transitionend', handleTransitionEnd);
	};

	const finish = (): void => {
		if (complete) return;

		complete = true;

		cancel();

		applyTarget();

		options.onComplete();
	};

	const handleTransitionEnd = (event: TransitionEvent): void => {
		if (event.propertyName === 'transform') finish();
	};

	surface.style.setProperty(options.durationProperty, `${duration}ms`);

	delete surface.dataset.swiping;

	void surface.offsetWidth;

	surface.addEventListener('transitionend', handleTransitionEnd);

	if (view?.requestAnimationFrame) {
		const paintBuffer = options.waitForPaint ? 50 : 0;

		timeout = view.setTimeout(finish, duration + MOTION_FALLBACK_BUFFER + paintBuffer);

		frame = view.requestAnimationFrame(() => {
			options.onReady?.();

			if (options.waitForPaint) {
				void surface.offsetWidth;

				frame = view.requestAnimationFrame(applyTarget);
			} else applyTarget();
		});
	} else {
		options.onReady?.();

		applyTarget();

		queueMicrotask(finish);
	}

	return cancel;
};
