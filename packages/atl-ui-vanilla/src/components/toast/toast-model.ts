import { ToastTimer } from './toast-timer';
import type { AltToastOptions, AltToastStatus } from './types';

export type ToastRecord = {
	dismissible: boolean;
	id: string;
	message: string;
	status: AltToastStatus;
	timer: ToastTimer;
};

let nextToastId = 0;

const normalizeDuration = (duration: number | undefined, fallback: number): number => {
	return duration === undefined || !Number.isFinite(duration) || duration < 0 ? fallback : duration;
};

export const createToastRecord = (
	options: AltToastOptions | string,
	defaultDuration: number,
	onElapsed: (id: string) => void,
): ToastRecord => {
	const normalized =
		typeof options === 'string'
			? {
					message: options,
				}
			: options;
	const id = normalized.id ?? `alt-toast-${++nextToastId}`;
	const duration = normalizeDuration(normalized.duration, defaultDuration);

	return {
		dismissible: normalized.dismissible ?? true,
		id,
		message: normalized.message,
		status: normalized.status ?? 'info',
		timer: new ToastTimer(duration, () => onElapsed(id)),
	};
};
