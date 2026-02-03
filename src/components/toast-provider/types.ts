export type ToastVariant = 'info' | 'success' | 'error';

export type ToastOptions = {
	variant?: ToastVariant;
	duration?: number;
};

export type ToastItem = {
	id: string;
	message: string;
	variant: ToastVariant;
	duration: number;
};

export type ToastContextValue = {
	enqueueToast: (message: string, options?: ToastOptions) => string;
	closeToast: (id: string) => void;
};
