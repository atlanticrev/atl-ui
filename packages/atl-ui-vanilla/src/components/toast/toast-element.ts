import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createToastDom, syncToastDom, type ToastDom } from './toast-dom';
import { bindToastInteractions } from './toast-interactions';
import { createToastRecord, type ToastRecord } from './toast-model';
import type { AltToastDismissDetail, AltToastDismissReason, AltToastOptions } from './types';

const DEFAULT_DURATION = 5_000;
const DEFAULT_MAX = 3;

const readNumber = (element: HTMLElement, name: string, fallback: number, minimum: number): number => {
	const attribute = element.getAttribute(name);
	if (attribute === null || attribute.trim() === '') return fallback;
	const value = Number(attribute);
	return Number.isFinite(value) && value >= minimum ? Math.floor(value) : fallback;
};

export const createAltToastRegionElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltToastRegionElement extends BaseElement {
		static observedAttributes = ['default-duration', 'max'];
		#dom: ToastDom | undefined;
		#records: ToastRecord[] = [];

		get defaultDuration(): number {
			return readNumber(this, 'default-duration', DEFAULT_DURATION, 0);
		}

		set defaultDuration(value: number) {
			this.setAttribute('default-duration', String(value));
		}

		get max(): number {
			return readNumber(this, 'max', DEFAULT_MAX, 1);
		}

		set max(value: number) {
			this.setAttribute('max', String(value));
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['defaultDuration', 'max']);
			this.classList.add('alt-toast-region');
			this.#dom ??= createToastDom(this);
			bindToastInteractions(this, signal, this.#handleClose, this.#setToastPaused);
		}

		push(options: AltToastOptions | string): string {
			const record = createToastRecord(options, this.defaultDuration, this.#handleElapsed);
			const existingIndex = this.#records.findIndex((item) => item.id === record.id);

			if (existingIndex >= 0) {
				this.#records[existingIndex].timer.cancel();
				this.#records[existingIndex] = record;
			} else {
				this.#records.push(record);
			}

			this.#enforceMax();
			this.requestUpdate();
			return record.id;
		}

		dismiss(id: string, reason: AltToastDismissReason = 'programmatic'): boolean {
			const index = this.#records.findIndex((record) => record.id === id);
			if (index < 0) return false;
			const [record] = this.#records.splice(index, 1);
			record.timer.cancel();
			this.dispatchEvent(
				createTypedEvent<AltToastDismissDetail>('alt-dismiss', {
					id: record.id,
					reason,
					status: record.status,
				}),
			);
			this.requestUpdate();
			return true;
		}

		clear(): void {
			for (const record of [...this.#records]) this.dismiss(record.id, 'clear');
		}

		update(): void {
			if (!this.#dom) return;
			this.#enforceMax();
			syncToastDom(this.#dom, this.#records);
			const window = this.ownerDocument.defaultView;
			const signal = this.connectionSignal;
			if (!window || !signal) return;
			for (const record of this.#records) record.timer.bind(window, signal);
		}

		#enforceMax(): void {
			while (this.#records.length > this.max) this.dismiss(this.#records[0].id, 'overflow');
		}

		#handleClose = (id: string): void => {
			this.dismiss(id, 'close');
		};

		#handleElapsed = (id: string): void => {
			this.dismiss(id, 'timeout');
		};

		#setToastPaused = (id: string, paused: boolean): void => {
			const record = this.#records.find((entry) => entry.id === id);
			if (paused) record?.timer.pause();
			else record?.timer.resume();
		};
	};
};
