const TYPEAHEAD_RESET_MS = 700;

export class TypeaheadController {
	#buffer = '';
	#timer: number | undefined;

	public constructor(
		private readonly view: Window,
		signal?: AbortSignal,
	) {
		signal?.addEventListener('abort', this.reset, { once: true });
	}

	public push(key: string): string {
		const normalized = key.toLocaleLowerCase();
		const repeated = this.#buffer.length > 0 && Array.from(this.#buffer).every((value) => value === normalized);
		this.#buffer = repeated ? normalized : `${this.#buffer}${normalized}`;
		if (this.#timer !== undefined) this.view.clearTimeout(this.#timer);
		this.#timer = this.view.setTimeout(this.reset, TYPEAHEAD_RESET_MS);
		return this.#buffer;
	}

	public readonly reset = (): void => {
		if (this.#timer !== undefined) this.view.clearTimeout(this.#timer);
		this.#buffer = '';
		this.#timer = undefined;
	};
}
