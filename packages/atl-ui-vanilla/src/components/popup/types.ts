import type { OverlayPlacement } from '../../controllers';

export type AltPopupOpenChangeDetail = {
	open: boolean;
};

export type AltPopupElementApi = HTMLElement & {
	anchor: Element | null;
	close: () => void;
	closeOnEscape: boolean;
	closeOnOutsideClick: boolean;
	flip: boolean;
	gap: number;
	open: boolean;
	placement: OverlayPlacement;
	show: () => void;
	toggle: () => void;
};
