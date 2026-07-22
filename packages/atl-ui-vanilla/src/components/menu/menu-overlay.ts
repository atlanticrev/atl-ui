import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';

export const bindMenuOverlay = (
	trigger: HTMLElement,
	menu: HTMLElement,
	onDismiss: (detail: { reason: 'escape' | 'outside-pointer' }) => void,
	signal: AbortSignal,
): (() => void) =>
	bindAnchoredOverlay({
		anchor: trigger,
		gap: 6,
		onDismiss,
		overlay: menu,
		placement: 'bottom-end',
		signal,
	});
