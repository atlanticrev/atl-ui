import { createBaseElementClass, upgradeProperties } from '../../core';

import { createToastDom, syncToastDom, type ToastDom } from './toast-dom';
import { dispatchToastDismissed } from './toast-events';
import { bindToastInteractions } from './toast-interactions';
import type { ToastPhase } from './toast-model';
import { readDefaultDuration, readMaxToasts, readPreventDuplicate, writePreventDuplicate } from './toast-properties';
import { ToastStore } from './toast-store';
import type { ToastPauseReason } from './toast-timer';
import { bindToastTransitions, type ToastTransitionCoordinator } from './toast-transitions';
import type { AltToastDismissReason, AltToastOptions } from './types';

export const createAltToastRegionElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltToastRegionElement extends BaseElement {
		static observedAttributes = ['default-duration', 'max', 'prevent-duplicate'];
		#dom: ToastDom | undefined;
		#transitions: ToastTransitionCoordinator | undefined;
		#store = new ToastStore(
			() => this.requestUpdate(),
			(record, reason) => dispatchToastDismissed(this, record, reason),
		);

		get defaultDuration(): number {
			return readDefaultDuration(this);
		}

		set defaultDuration(value: number) {
			this.setAttribute('default-duration', String(value));
		}

		get max(): number {
			return readMaxToasts(this);
		}

		set max(value: number) {
			this.setAttribute('max', String(value));
		}

		get preventDuplicate(): boolean {
			return readPreventDuplicate(this);
		}

		set preventDuplicate(value: boolean) {
			writePreventDuplicate(this, value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['defaultDuration', 'max', 'preventDuplicate']);
			this.classList.add('alt-toast-region');
			this.#dom ??= createToastDom(this);
			this.#transitions = bindToastTransitions(this, signal, this.#handleTransition);
			bindToastInteractions(this, signal, this.#handleClose, this.#setToastPaused, this.#setAllPaused);
			this.#setAllPaused('document-hidden', this.ownerDocument.hidden);
		}

		onDisconnected(): void {
			this.#transitions = undefined;
		}

		push(options: AltToastOptions | string): string {
			return this.#store.push(options, this.defaultDuration, this.max, this.preventDuplicate);
		}

		dismiss(id: string, reason: AltToastDismissReason = 'programmatic'): boolean {
			return this.#store.dismiss(id, reason, this.max);
		}

		clear(): void {
			this.#store.clear();
		}

		update(): void {
			if (!this.#dom) return;
			this.#store.reconcile(this.max);
			const records = this.#store.visibleRecords;
			const items = syncToastDom(this.#dom, records);
			const window = this.ownerDocument.defaultView;
			const signal = this.connectionSignal;
			if (!window || !signal) return;
			this.#store.bindTimers(window, signal);
			for (const record of records) {
				const item = items.get(record.id);
				if (item) this.#transitions?.sync(item, record.phase);
			}
		}

		#handleClose = (id: string): void => {
			this.dismiss(id, 'close');
		};

		#handleTransition = (id: string, phase: ToastPhase): void => {
			this.#store.complete(id, phase, this.max);
		};

		#setToastPaused = (id: string, reason: ToastPauseReason, paused: boolean): void => {
			this.#store.setPaused(id, reason, paused);
		};

		#setAllPaused = (reason: ToastPauseReason, paused: boolean): void => {
			this.#store.setAllPaused(reason, paused);
		};
	};
};
