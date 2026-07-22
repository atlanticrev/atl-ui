import { bindAnchoredOverlay } from '../../controllers/anchored-overlay';

import type { SelectDom } from './dom';

export const showSelectOverlay = (
	dom: SelectDom,
	onDismiss: (reason: 'escape' | 'outside', event: Event) => void,
	signal: AbortSignal,
): (() => void) => {
	return bindAnchoredOverlay({
		anchor: dom.trigger,
		matchAnchorWidth: true,
		onDismiss: ({ event, reason }) => onDismiss(reason === 'escape' ? 'escape' : 'outside', event),
		overlay: dom.popup,
		signal,
	});
};
