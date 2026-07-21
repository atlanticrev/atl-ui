export type AltDialogSize = 520 | 620 | 760 | 848;

export type AltDialogOpenChangeDetail = {
	open: boolean;
};

export type AltDialogCloseDetail = {
	returnValue: string;
};

export type AltDialogElementApi = HTMLElement & {
	close: (returnValue?: string) => void;
	dialogElement: HTMLDialogElement | null;
	open: boolean;
	returnValue: string;
	showModal: () => void;
	size: AltDialogSize;
};
