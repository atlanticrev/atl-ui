export type ToastPauseReason = 'disconnected' | 'document-hidden' | 'focus' | 'lifecycle' | 'pointer' | 'window-blur';

export class ToastTimer {
	#deadline = 0;
	#pauseReasons = new Set<ToastPauseReason>(['disconnected']);
	#remaining: number;
	#signal: AbortSignal | undefined;
	#timeout: number | undefined;
	#window: Window | undefined;

	public constructor(
		duration: number,
		private readonly onElapsed: () => void,
	) {
		this.#remaining = Math.max(0, duration);
	}

	public bind(window: Window, signal: AbortSignal): void {
		if (this.#signal === signal) {
			return;
		}

		this.#signal = signal;
		this.#window = window;
		signal.addEventListener(
			'abort',
			() => {
				if (this.#signal !== signal) return;
				this.pause('disconnected');
				this.#signal = undefined;
			},
			{
				once: true,
			},
		);
		this.resume('disconnected');
	}

	public cancel(): void {
		this.#stop();
		this.#remaining = 0;
		this.#signal = undefined;
		this.#pauseReasons.clear();
	}

	public pause(reason: ToastPauseReason): void {
		this.#pauseReasons.add(reason);
		this.#stop();
	}

	public resume(reason: ToastPauseReason): void {
		this.#pauseReasons.delete(reason);
		if (this.#pauseReasons.size > 0 || this.#timeout !== undefined || this.#remaining === 0 || !this.#window) {
			return;
		}

		this.#deadline = Date.now() + this.#remaining;
		this.#timeout = this.#window.setTimeout(() => {
			this.#timeout = undefined;
			this.#remaining = 0;
			this.onElapsed();
		}, this.#remaining);
	}

	#stop(): void {
		if (this.#timeout === undefined || !this.#window) return;
		this.#window.clearTimeout(this.#timeout);
		this.#timeout = undefined;
		this.#remaining = Math.max(0, this.#deadline - Date.now());
	}
}
