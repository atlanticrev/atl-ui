import { createToastRecord, getToastMessage, type ToastPhase, type ToastRecord } from './toast-model';
import { advanceToastPhase, reconcileToastCapacity, requestToastClose } from './toast-records';
import type { ToastPauseReason } from './toast-timer';
import type { AltToastDismissReason, AltToastOptions } from './types';

type DismissCallback = (record: ToastRecord, reason: AltToastDismissReason) => void;

export class ToastStore {
	#globalPauses = new Set<ToastPauseReason>();
	#records: ToastRecord[] = [];

	public constructor(
		private readonly onChange: () => void,
		private readonly onDismiss: DismissCallback,
	) {}

	public get visibleRecords(): ToastRecord[] {
		return this.#records.filter((record) => record.phase !== 'queued');
	}

	public push(
		options: AltToastOptions | string,
		defaultDuration: number,
		max: number,
		preventDuplicate: boolean,
	): string {
		const explicitId = typeof options === 'string' ? undefined : options.id;
		const existingIndex = explicitId ? this.#records.findIndex((record) => record.id === explicitId) : -1;
		const prevent = typeof options === 'string' ? preventDuplicate : (options.preventDuplicate ?? preventDuplicate);
		const duplicate = prevent
			? this.#records.find((record) => record.message === getToastMessage(options))
			: undefined;
		if (existingIndex < 0 && duplicate) return duplicate.id;

		const record = createToastRecord(options, defaultDuration, this.#handleElapsed);
		for (const reason of this.#globalPauses) record.timer.pause(reason);

		if (existingIndex >= 0) this.#replace(existingIndex, record);
		else this.#records.push(record);

		reconcileToastCapacity(this.#records, max, requestToastClose);
		this.onChange();
		return record.id;
	}

	public dismiss(id: string, reason: AltToastDismissReason, max: number): boolean {
		const record = this.#records.find((entry) => entry.id === id);
		if (!record || record.closeReason) return false;
		if (record.phase === 'queued') this.#remove(record, reason, max);
		else if (requestToastClose(record, reason)) this.onChange();
		return true;
	}

	public clear(): void {
		const queued = this.#records.filter((record) => record.phase === 'queued');
		for (const record of queued) {
			record.timer.cancel();
			this.onDismiss(record, 'clear');
		}
		this.#records = this.#records.filter((record) => record.phase !== 'queued');
		for (const record of this.#records) requestToastClose(record, 'clear');
		this.onChange();
	}

	public complete(id: string, phase: ToastPhase, max: number): void {
		const record = this.#records.find((entry) => entry.id === id);
		if (!record) return;
		const result = advanceToastPhase(record, phase);
		if (result === 'stale') return;
		if (result === 'remove') this.#remove(record, record.closeReason ?? 'programmatic', max);
		else this.onChange();
	}

	public reconcile(max: number): void {
		if (reconcileToastCapacity(this.#records, max, requestToastClose)) this.onChange();
	}

	public bindTimers(window: Window, signal: AbortSignal): void {
		for (const record of this.#records) record.timer.bind(window, signal);
	}

	public setPaused(id: string, reason: ToastPauseReason, paused: boolean): void {
		const timer = this.#records.find((record) => record.id === id)?.timer;
		if (paused) timer?.pause(reason);
		else timer?.resume(reason);
	}

	public setAllPaused(reason: ToastPauseReason, paused: boolean): void {
		if (paused) this.#globalPauses.add(reason);
		else this.#globalPauses.delete(reason);
		for (const record of this.#records) this.setPaused(record.id, reason, paused);
	}

	#handleElapsed = (id: string): void => {
		this.dismiss(id, 'timeout', Number.POSITIVE_INFINITY);
	};

	#remove(record: ToastRecord, reason: AltToastDismissReason, max: number): void {
		record.timer.cancel();
		this.#records = this.#records.filter((entry) => entry !== record);
		this.onDismiss(record, reason);
		reconcileToastCapacity(this.#records, max, requestToastClose);
		this.onChange();
	}

	#replace(index: number, replacement: ToastRecord): void {
		const current = this.#records[index];
		current.timer.cancel();
		replacement.phase = current.phase;
		replacement.closeReason = current.closeReason;
		if (replacement.closeReason) replacement.timer.cancel();
		else if (replacement.phase === 'open') replacement.timer.resume('lifecycle');
		this.#records[index] = replacement;
	}
}
