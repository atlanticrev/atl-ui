import { ToastTimer } from './toast-timer';
import type { AltToastDismissReason, AltToastOptions, AltToastStatus } from './types';

export type ToastPhase = 'queued' | 'entering' | 'open' | 'closing' | 'collapsing';

export type ToastRecord = {
	closeReason?: AltToastDismissReason;
	dismissible: boolean;
	dismissIcon?: Node | null;
	id: string;
	icon?: Node | null;
	message: string;
	persist: boolean;
	phase: ToastPhase;
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
	const timer = new ToastTimer(normalized.persist ? 0 : duration, () => onElapsed(id));
	timer.pause('lifecycle');

	return {
		dismissible: normalized.dismissible ?? true,
		dismissIcon: normalized.dismissIcon,
		id,
		icon: normalized.icon,
		message: normalized.message,
		persist: normalized.persist ?? duration === 0,
		phase: 'queued',
		status: normalized.status ?? 'info',
		timer,
	};
};

export const getToastMessage = (options: AltToastOptions | string): string => {
	return typeof options === 'string' ? options : options.message;
};
