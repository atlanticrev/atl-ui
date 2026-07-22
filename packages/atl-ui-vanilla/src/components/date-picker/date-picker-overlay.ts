import type { OverlayDismissDetail } from '../../controllers';
import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';
import { lockDocumentScroll } from '../../controllers/document-scroll-lock';
import { bindSwipeDismiss } from '../../controllers/swipe-dismiss';
import { animateSwipeSettle } from '../../controllers/swipe-dismiss-animation';

const MOBILE_BREAKPOINT = 520;

export type DatePickerDismissReason = OverlayDismissDetail['reason'] | 'gesture';

type DatePickerDismissDetail = {
	reason: DatePickerDismissReason;
};

const clearSheetMotion = (panel: HTMLElement): void => {
	delete panel.dataset.swiping;

	panel.style.removeProperty('--alt-date-picker-sheet-snap-duration');

	panel.style.removeProperty('transform');
};

const bindSheetSwipe = (
	panel: HTMLDivElement,
	onDismiss: (detail: DatePickerDismissDetail) => void,
	signal: AbortSignal,
	enabled: () => boolean,
): void => {
	let cancelAnimation: (() => void) | undefined;

	bindSwipeDismiss({
		enabled: () => enabled() && !panel.hidden,
		onDrag: ({ closingOffset }) => {
			panel.style.transform = `translate3d(0, ${closingOffset}px, 0)`;
		},
		onSettle: ({ dismiss, duration }) => {
			cancelAnimation?.();

			cancelAnimation = animateSwipeSettle(panel, {
				duration,
				durationProperty: '--alt-date-picker-sheet-snap-duration',
				onComplete: () => {
					if (dismiss) onDismiss({ reason: 'gesture' });
					else clearSheetMotion(panel);
				},
				onTarget: () => {
					panel.style.transform = dismiss ? 'translate3d(0, 100%, 0)' : 'translate3d(0, 0, 0)';
				},
			});
		},
		placement: () => 'bottom',
		signal,
		surface: panel,
	});

	signal.addEventListener(
		'abort',
		() => {
			cancelAnimation?.();

			clearSheetMotion(panel);
		},
		{ once: true },
	);
};

export const bindDatePickerOverlay = (
	panel: HTMLDivElement,
	trigger: HTMLElement,
	onDismiss: (detail: DatePickerDismissDetail) => void,
	signal: AbortSignal,
): (() => void) => {
	const view = trigger.ownerDocument.defaultView;

	const AbortControllerConstructor = view?.AbortController ?? globalThis.AbortController;

	const controller = new AbortControllerConstructor();

	const isMobile = (): boolean => {
		const viewportWidth = view?.innerWidth ?? trigger.ownerDocument.documentElement.clientWidth;

		return viewportWidth <= MOBILE_BREAKPOINT;
	};

	const releaseScrollLock = isMobile() ? lockDocumentScroll(trigger.ownerDocument) : undefined;

	const cleanupOverlay = bindAnchoredOverlay({
		anchor: trigger,
		flip: true,
		gap: 8,
		onDismiss,
		onPosition: ({ left, top }) => {
			const viewportWidth = view?.innerWidth ?? trigger.ownerDocument.documentElement.clientWidth;

			if (viewportWidth <= MOBILE_BREAKPOINT) {
				panel.style.removeProperty('left');

				panel.style.removeProperty('top');

				return;
			}

			panel.style.left = `${left}px`;

			panel.style.top = `${top}px`;
		},
		overlay: panel,
		placement: 'bottom-start',
		signal,
	});

	bindSheetSwipe(panel, onDismiss, controller.signal, isMobile);

	const cleanup = (): void => {
		controller.abort();

		cleanupOverlay();

		releaseScrollLock?.();
	};

	signal.addEventListener('abort', cleanup, { once: true });

	return cleanup;
};
