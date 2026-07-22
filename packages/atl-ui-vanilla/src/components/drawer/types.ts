export type AltDrawerPlacement = 'bottom' | 'left' | 'right' | 'top';

export type AltDrawerCloseReason = 'action' | 'backdrop' | 'escape' | 'gesture' | 'programmatic';

export type AltDrawerOpenChangeDetail = {
	open: boolean;
	reason: AltDrawerCloseReason;
};

export type AltDrawerCloseDetail = {
	reason: AltDrawerCloseReason;
	returnValue: string;
};

export type AltDrawerElementApi = HTMLElement & {
	close: (returnValue?: string) => void;
	closeOnBackdrop: boolean;
	closeOnEscape: boolean;
	dialogElement: HTMLDialogElement | null;
	label: string;
	labelledBy: string;
	open: boolean;
	placement: AltDrawerPlacement;
	returnValue: string;
	showModal: () => void;
	swipeToClose: boolean;
};
