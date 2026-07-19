import { bindFormReset } from '../../controllers';
import { createTypedEvent } from '../../core';

import { createSelectDom, type SelectDom } from './dom';
import { bindSelectInteractions, type SelectInteractionCallbacks } from './interactions';
import { SelectModel } from './model';
import type { OptionView } from './option-view';
import { showSelectOverlay } from './overlay';
import { createSelectionInteractions } from './selection-interactions';
import { ALT_SELECT_OPEN_CHANGE_EVENT, type AltSelectOpenChangeDetail } from './types';
import { renderSelect } from './view';

export class SelectRuntime {
	readonly interactions: SelectInteractionCallbacks;
	readonly model: SelectModel;
	#dom: SelectDom | undefined;
	#open = false;
	#overlayCleanup: (() => void) | undefined;
	#resetCleanup: (() => void) | undefined;
	#signal: AbortSignal | undefined;
	#views = new Map<string, OptionView>();

	public constructor(private readonly host: HTMLElement) {
		this.model = new SelectModel(host);
		this.interactions = createSelectionInteractions(host, this.model, this, this.render);
	}

	public connect(signal: AbortSignal): void {
		this.#signal = signal;
		this.#dom ??= createSelectDom(this.host);
		this.model.initialize();
		bindSelectInteractions(this.host, this.#dom, this.interactions, signal);
		this.#dom.carrier.addEventListener('invalid', this.#handleInvalid, { signal });
		signal.addEventListener('abort', this.disconnect, { once: true });
		this.render();

		if (this.#open) {
			this.#showOverlay();
		}
	}

	public readonly disconnect = (): void => {
		this.#overlayCleanup?.();
		this.#resetCleanup?.();
		this.#overlayCleanup = undefined;
		this.#resetCleanup = undefined;
		this.#signal = undefined;
	};

	public readonly render = (): void => {
		if (!this.#dom) {
			return;
		}

		this.model.setMultiple(this.host.hasAttribute('multiple'));
		renderSelect(this.host, this.#dom, this.model, this.#views, this.#open);
		this.#resetCleanup?.();
		this.#resetCleanup = bindFormReset(this.#dom.carrier, this.#handleReset, this.#signal);
	};

	public setOpen(open: boolean): void {
		const nextOpen = open && !this.host.hasAttribute('disabled');

		if (nextOpen === this.#open) {
			return;
		}

		if (!nextOpen) {
			this.#hideOverlay();
		}

		this.#open = nextOpen;
		this.host.toggleAttribute('open', nextOpen);
		this.render();

		if (nextOpen) {
			this.#showOverlay();
		}

		if (this.host.isConnected) {
			const detail: AltSelectOpenChangeDetail = { open: nextOpen };
			this.host.dispatchEvent(createTypedEvent(ALT_SELECT_OPEN_CHANGE_EVENT, detail));
		}
	}

	public readonly open = (): void => this.setOpen(true);
	public readonly close = (): void => this.setOpen(false);
	public readonly toggle = (): void => this.setOpen(!this.#open);
	public readonly isOpen = (): boolean => this.#open;

	readonly #handleReset = (): void => {
		this.model.reset();
		this.render();
	};

	readonly #handleInvalid = (event: Event): void => {
		event.preventDefault();

		if (this.host.getAttribute('aria-invalid') !== 'true') {
			this.host.dataset.validationInvalid = 'true';
			this.host.setAttribute('aria-invalid', 'true');
		}

		this.#dom?.trigger.setAttribute('aria-invalid', 'true');
		this.#dom?.trigger.focus();
	};
	#showOverlay(): void {
		if (!this.#dom || !this.#signal || this.#signal.aborted) {
			return;
		}

		this.#overlayCleanup?.();
		this.#overlayCleanup = showSelectOverlay(this.#dom, this.close, this.#signal);
	}

	#hideOverlay(): void {
		this.#overlayCleanup?.();
		this.#overlayCleanup = undefined;
	}
}
