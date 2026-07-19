export type AltToastStatus = 'info' | 'success' | 'warning' | 'error';

export type AltToastOptions = {
	dismissible?: boolean;
	duration?: number;
	id?: string;
	message: string;
	persist?: boolean;
	preventDuplicate?: boolean;
	status?: AltToastStatus;
};

export type AltToastDismissReason = 'clear' | 'close' | 'overflow' | 'programmatic' | 'timeout';

export type AltToastDismissDetail = {
	id: string;
	reason: AltToastDismissReason;
	status: AltToastStatus;
};

export type AltToastElementApi = HTMLElement & {
	clear: () => void;
	defaultDuration: number;
	dismiss: (id: string) => boolean;
	max: number;
	preventDuplicate: boolean;
	push: (options: AltToastOptions | string) => string;
};
