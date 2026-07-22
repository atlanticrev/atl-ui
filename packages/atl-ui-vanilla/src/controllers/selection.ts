export type SelectionMode = 'multiple' | 'single';

const unique = (values: readonly string[]): string[] => [...new Set(values)];

export class SelectionController {
	readonly mode: SelectionMode;
	#values: string[];

	constructor(mode: SelectionMode, initialValues: readonly string[] = []) {
		this.mode = mode;

		this.#values = this.normalize(initialValues);
	}

	get value(): string | null {
		return this.#values[0] ?? null;
	}

	get values(): readonly string[] {
		return [...this.#values];
	}

	has(value: string): boolean {
		return this.#values.includes(value);
	}

	set(values: readonly string[]): boolean {
		return this.replace(this.normalize(values));
	}

	select(value: string): boolean {
		if (this.mode === 'single') {
			return this.replace([value]);
		}

		return this.has(value) ? false : this.replace([...this.#values, value]);
	}

	deselect(value: string): boolean {
		return this.has(value) ? this.replace(this.#values.filter((candidate) => candidate !== value)) : false;
	}

	toggle(value: string): boolean {
		return this.has(value) ? this.deselect(value) : this.select(value);
	}

	clear(): boolean {
		return this.replace([]);
	}

	private normalize(values: readonly string[]): string[] {
		const normalized = unique(values);
		return this.mode === 'single' ? normalized.slice(0, 1) : normalized;
	}

	private replace(values: string[]): boolean {
		if (values.length === this.#values.length && values.every((value, index) => value === this.#values[index])) {
			return false;
		}

		this.#values = values;

		return true;
	}
}
