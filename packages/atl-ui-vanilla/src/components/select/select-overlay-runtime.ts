import type { OpenChangeReason } from '../../controllers';

import type { SelectDom } from './dom';
import { showSelectOverlay } from './overlay';

export type SelectDismiss = (reason: OpenChangeReason, event?: Event) => void;

export class SelectOverlayRuntime {
	#cleanup: (() => void) | undefined;
	#dismiss: SelectDismiss | undefined;
	#dom: SelectDom | undefined;
	#signal: AbortSignal | undefined;

	public connect(dom: SelectDom, signal: AbortSignal, dismiss: SelectDismiss): void {
		this.#dom = dom;

		this.#signal = signal;

		this.#dismiss = dismiss;
	}

	public disconnect(): void {
		this.#cleanup?.();

		this.#cleanup = undefined;

		this.#dom = undefined;

		this.#dismiss = undefined;

		this.#signal = undefined;
	}

	public setOpen(open: boolean): void {
		this.#cleanup?.();

		this.#cleanup = undefined;

		if (!open || !this.#dom || !this.#dismiss || !this.#signal || this.#signal.aborted) return;

		this.#cleanup = showSelectOverlay(this.#dom, this.#dismiss, this.#signal);
	}
}
