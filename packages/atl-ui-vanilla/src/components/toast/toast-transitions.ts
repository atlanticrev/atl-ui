import type { ToastPhase } from './toast-model';

type AnimatedPhase = Extract<ToastPhase, 'entering' | 'closing' | 'collapsing'>;
type CompleteTransition = (id: string, phase: AnimatedPhase) => void;

type ArmedTransition = {
	phase: AnimatedPhase;
	timeout: number;
};

const transitionConfig: Record<AnimatedPhase, { animation: string; fallback: number; selector: string }> = {
	entering: {
		animation: 'alt-toast-expand',
		fallback: 500,
		selector: '.alt-toast-region__item',
	},
	closing: {
		animation: 'alt-toast-exit',
		fallback: 450,
		selector: '.alt-toast',
	},
	collapsing: {
		animation: 'alt-toast-collapse',
		fallback: 450,
		selector: '.alt-toast-region__item',
	},
};

const parseTime = (value: string): number => {
	const parsed = Number.parseFloat(value);

	if (!Number.isFinite(parsed)) return 0;

	return value.trim().endsWith('ms') ? parsed : parsed * 1_000;
};

const readAnimationTime = (element: Element): number => {
	const view = element.ownerDocument.defaultView;

	if (!view) return 0;

	const style = view.getComputedStyle(element);

	const durations = style.animationDuration.split(',').map(parseTime);

	const delays = style.animationDelay.split(',').map(parseTime);

	return durations.reduce((longest, duration, index) => {
		return Math.max(longest, duration + (delays[index] ?? delays[0] ?? 0));
	}, 0);
};

export type ToastTransitionCoordinator = {
	sync: (item: HTMLElement, phase: ToastPhase) => void;
};

export const bindToastTransitions = (
	host: HTMLElement,
	signal: AbortSignal,
	onComplete: CompleteTransition,
): ToastTransitionCoordinator => {
	const armed = new Map<string, ArmedTransition>();

	const view = host.ownerDocument.defaultView;

	const cancel = (id: string): void => {
		const current = armed.get(id);

		if (current && view) view.clearTimeout(current.timeout);

		armed.delete(id);
	};

	const complete = (id: string, phase: AnimatedPhase): void => {
		if (armed.get(id)?.phase !== phase) return;

		cancel(id);

		onComplete(id, phase);
	};

	host.addEventListener(
		'animationend',
		(event) => {
			const animationEvent = event as AnimationEvent;

			const target = event.target as Element | null;

			const item = target?.closest<HTMLElement>('.alt-toast-region__item');

			const id = item?.dataset.toastId;

			const current = id ? armed.get(id) : undefined;

			if (!id || !current) return;

			const config = transitionConfig[current.phase];

			if (!target || animationEvent.animationName !== config.animation || !target.matches(config.selector))
				return;

			complete(id, current.phase);
		},
		{ signal },
	);

	signal.addEventListener('abort', () => {
		for (const id of armed.keys()) cancel(id);
	});

	return {
		sync: (item, phase) => {
			const id = item.dataset.toastId;

			if (!id || phase === 'open' || phase === 'queued') {
				if (id) cancel(id);

				return;
			}

			if (armed.get(id)?.phase === phase || !view) return;

			cancel(id);

			const config = transitionConfig[phase];

			const target = item.matches(config.selector) ? item : item.querySelector(config.selector);

			const animationTime = target ? readAnimationTime(target) : 0;

			const timeout = view.setTimeout(() => complete(id, phase), Math.max(config.fallback, animationTime + 100));

			armed.set(id, {
				phase,
				timeout,
			});
		},
	};
};
