'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { AtlButton } from '@/components/button';
import { clsx } from '@/lib/clsx';

import type { ToastContextValue, ToastItem, ToastOptions, ToastVariant } from './types';

type ToastProviderProps = {
	children: React.ReactNode;
};

type ToastCardProps = {
	toast: ToastItem;
	onDismiss: (id: string) => void;
};

const TOAST_LIMIT = 3;
const DEFAULT_DURATION = 4200;
const DEFAULT_VARIANT: ToastVariant = 'info';

const ToastContext = createContext<ToastContextValue | null>(null);

const AtlToastCard = ({ toast, onDismiss }: ToastCardProps) => {
	const handleDismiss = () => {
		onDismiss(toast.id);
	};

	const classes = clsx('atl-toast', `atl-toast--${toast.variant}`);

	const role = toast.variant === 'error' ? 'alert' : 'status';

	return (
		<div
			aria-live="polite"
			className={classes}
			role={role}
		>
			<span className="atl-toast__message">{toast.message}</span>

			<AtlButton
				aria-label="Dismiss"
				className="atl-toast__dismiss"
				onClick={handleDismiss}
				variant="text"
				type="button"
			>
				Dismiss
			</AtlButton>
		</div>
	);
};

export const AtlToastProvider = ({ children }: ToastProviderProps) => {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const idRef = useRef(0);
	const timeoutsRef = useRef<Map<string, number>>(new Map());

	const closeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));

		const timeoutId = timeoutsRef.current.get(id);
		if (timeoutId) {
			window.clearTimeout(timeoutId);
			timeoutsRef.current.delete(id);
		}
	}, []);

	const enqueueToast = useCallback(
		(message: string, options?: ToastOptions) => {
			idRef.current += 1;
			const id = `toast-${idRef.current}`;
			const duration = options?.duration ?? DEFAULT_DURATION;
			const variant = options?.variant ?? DEFAULT_VARIANT;

			const nextToast: ToastItem = {
				id,
				message,
				variant,
				duration,
			};

			setToasts((prev) => {
				const next = [nextToast, ...prev];
				return next.slice(0, TOAST_LIMIT);
			});

			const handleDismiss = () => {
				closeToast(id);
			};

			const timeoutId = window.setTimeout(handleDismiss, duration);
			timeoutsRef.current.set(id, timeoutId);

			return id;
		},
		[closeToast],
	);

	const value = useMemo(
		() => ({
			enqueueToast,
			closeToast,
		}),
		[enqueueToast, closeToast],
	);

	const renderToast = (toast: ToastItem) => (
		<AtlToastCard
			key={toast.id}
			onDismiss={closeToast}
			toast={toast}
		/>
	);

	return (
		<ToastContext.Provider value={value}>
			{children}

			<div className="atl-toast-provider">
				<div className="atl-toast-provider__stack">{toasts.map(renderToast)}</div>
			</div>
		</ToastContext.Provider>
	);
};

export const useAtlToast = () => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error('useAtlToast must be used within AtlToastProvider.');
	}

	return context;
};
