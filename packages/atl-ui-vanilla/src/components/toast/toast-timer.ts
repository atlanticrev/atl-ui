export class ToastTimer {
	#deadline = 0;
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
				this.pause();
				this.#signal = undefined;
			},
			{
				once: true,
			},
		);
		this.resume();
	}

	public cancel(): void {
		this.pause();
		this.#remaining = 0;
		this.#signal = undefined;
	}

	public pause(): void {
		if (this.#timeout === undefined || !this.#window) {
			return;
		}

		this.#window.clearTimeout(this.#timeout);
		this.#timeout = undefined;
		this.#remaining = Math.max(0, this.#deadline - Date.now());
	}

	public resume(): void {
		if (this.#timeout !== undefined || this.#remaining === 0 || !this.#window) {
			return;
		}

		this.#deadline = Date.now() + this.#remaining;
		this.#timeout = this.#window.setTimeout(() => {
			this.#timeout = undefined;
			this.#remaining = 0;
			this.onElapsed();
		}, this.#remaining);
	}
}
