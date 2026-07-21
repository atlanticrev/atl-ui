import { SelectionController } from '../../controllers';

import { findEnabledOption, normalizeOptions, readDeclarativeOptions } from './options';
import type { AltSelectOption } from './types';

export class SelectModel {
	activeValue: string | undefined;
	defaultValues: string[] = [];
	#initialized = false;
	#options: AltSelectOption[] = [];
	#optionsOverride: AltSelectOption[] | undefined;
	#selection = new SelectionController('single');
	#selectionAssigned = false;

	public constructor(private readonly host: HTMLElement) {}

	public get options(): readonly AltSelectOption[] {
		return this.#options.map((option) => ({ ...option }));
	}

	public set options(value: readonly AltSelectOption[]) {
		this.#optionsOverride = normalizeOptions(value);
		this.refreshOptions();
	}

	public get value(): string {
		return this.#selection.value ?? '';
	}

	public get values(): readonly string[] {
		return this.#selection.values;
	}

	public initialize(): void {
		this.refreshOptions();
		this.setMultiple(this.host.hasAttribute('multiple'));

		if (!this.#initialized && !this.#selectionAssigned) {
			const attributeValue = this.host.getAttribute('value');
			const selected = this.#options.filter((option) => option.selected).map((option) => option.value);
			this.#selection.set(attributeValue === null ? selected : [attributeValue]);
		}

		if (!this.#initialized) {
			this.defaultValues = [...this.#selection.values];
			this.#initialized = true;
		}

		this.ensureActive();
	}

	public refreshOptions(): void {
		this.#options = this.#optionsOverride ?? readDeclarativeOptions(this.host);
		this.ensureActive();
	}

	public setMultiple(multiple: boolean): void {
		const mode = multiple ? 'multiple' : 'single';

		if (this.#selection.mode !== mode) {
			this.#selection = new SelectionController(mode, this.#selection.values);
		}
	}

	public setValues(values: readonly string[]): boolean {
		this.#selectionAssigned = true;
		return this.#selection.set(values);
	}

	public selectActive(): boolean {
		if (!this.activeValue) {
			return false;
		}

		return this.#selection.mode === 'multiple'
			? this.#selection.toggle(this.activeValue)
			: this.#selection.select(this.activeValue);
	}

	public select(value: string): boolean {
		const option = this.#options.find((candidate) => candidate.value === value && !candidate.disabled);
		if (!option) return false;
		this.activeValue = value;
		return this.selectActive();
	}

	public moveActive(direction: 1 | -1, edge?: 'end' | 'start'): void {
		const currentIndex = this.#options.findIndex((option) => option.value === this.activeValue);
		const edgeIndex = edge === 'end' ? this.#options.length - 1 : 0;
		const start = edge ? edgeIndex : Math.max(0, currentIndex + direction);
		this.activeValue = findEnabledOption(this.#options, start, direction)?.value;
	}

	public moveToMatch(query: string): void {
		const options = this.#options.filter((option) => !option.disabled);
		const currentIndex = options.findIndex((option) => option.value === this.activeValue);
		const ordered = [...options.slice(currentIndex + 1), ...options.slice(0, currentIndex + 1)];
		const match = ordered.find((option) => option.label.toLocaleLowerCase().startsWith(query));
		if (match) this.activeValue = match.value;
	}

	public reset(): void {
		this.#selection.set(this.defaultValues);
	}

	private ensureActive(): void {
		const active = this.#options.find((option) => option.value === this.activeValue && !option.disabled);
		const selected = this.#options.find((option) => this.#selection.has(option.value) && !option.disabled);
		this.activeValue = active?.value ?? selected?.value ?? findEnabledOption(this.#options, 0, 1)?.value;
	}
}
