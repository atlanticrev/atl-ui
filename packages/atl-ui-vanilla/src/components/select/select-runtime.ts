import { OpenStateController, type OpenChangeReason } from '../../controllers';

import { createSelectDom, type SelectDom } from './dom';
import { bindSelectInteractions, type SelectInteractionCallbacks } from './interactions';
import { emitSelectChange } from './events';
import { SelectFormRuntime } from './select-form-runtime';
import { syncSelectIndicatorIcon } from './select-indicator-icon';
import { SelectModel } from './model';
import type { OptionView } from './option-view';
import { SelectOverlayRuntime } from './select-overlay-runtime';
import { bindSelectOutline } from './select-outline';
import { createSelectionInteractions } from './selection-interactions';
import { SelectTriggerRuntime } from './select-trigger-runtime';
import { renderSelect } from './view';

export class SelectRuntime {
	readonly interactions: SelectInteractionCallbacks;
	readonly model: SelectModel;
	#dom: SelectDom | undefined;
	#form: SelectFormRuntime;
	#openState: OpenStateController;
	#overlay = new SelectOverlayRuntime();
	#trigger: SelectTriggerRuntime;
	#views = new Map<string, OptionView>();

	public constructor(private readonly host: HTMLElement) {
		this.model = new SelectModel(host);

		this.#form = new SelectFormRuntime(host, this.model, this.render);

		this.#openState = new OpenStateController(host, {
			isDisabled: () => host.hasAttribute('disabled'),
			onCommit: this.#commitOpen,
		});

		this.interactions = createSelectionInteractions(host, this.model, this, this.render);

		this.#trigger = new SelectTriggerRuntime(host, this.interactions, this.#handleTriggerChange);
	}

	public connect(signal: AbortSignal): void {
		this.#dom ??= createSelectDom(this.host);

		this.#trigger.connect(this.#dom, signal);

		this.#overlay.connect(this.#dom, signal, (reason, event) => this.setOpen(false, reason, event));

		this.model.initialize();

		bindSelectInteractions(this.host, this.#dom, this.interactions, signal);

		this.#form.connect(this.#dom, signal);

		signal.addEventListener('abort', this.disconnect, { once: true });

		this.render();

		bindSelectOutline(this.host, this.#dom, signal);

		if (this.#openState.open) {
			this.#overlay.setOpen(true);
		}
	}

	public readonly disconnect = (): void => {
		this.#overlay.disconnect();

		this.#form.disconnect();

		this.#trigger.disconnect();
	};

	public readonly render = (): void => {
		if (!this.#dom) {
			return;
		}

		this.model.setMultiple(this.host.hasAttribute('multiple'));

		renderSelect(this.host, this.#dom, this.model, this.#views, this.#openState.open);

		syncSelectIndicatorIcon(this.host, this.#dom);

		this.#form.sync(this.#dom);
	};

	public setOpen(open: boolean, reason: OpenChangeReason = 'programmatic', sourceEvent?: Event): void {
		this.#openState.request(open, reason, sourceEvent);
	}

	public readonly open = (event?: Event): void => this.setOpen(true, event ? 'trigger' : 'programmatic', event);
	public readonly close = (event?: Event): void => {
		const isEscape = (event as KeyboardEvent | undefined)?.key === 'Escape';

		this.setOpen(false, isEscape ? 'escape' : event ? 'selection' : 'programmatic', event);
	};
	public readonly toggle = (event?: Event): void => {
		this.setOpen(!this.#openState.open, event ? 'trigger' : 'programmatic', event);
	};
	public readonly isOpen = (): boolean => this.#openState.open;
	public readonly syncOpenAttribute = (open: boolean): void => this.#openState.syncAttribute(open);

	public clear(): void {
		if (!this.model.setValues([])) return;

		this.render();

		emitSelectChange(this.host, this.model, 'clear');
	}

	public select(value: string): boolean {
		const wasSelected = this.model.values.includes(value);

		if (!this.model.select(value)) return false;

		this.render();

		emitSelectChange(this.host, this.model, wasSelected ? 'remove' : 'select');

		return true;
	}

	public get triggerElement(): HTMLElement | null {
		return this.#trigger.element;
	}

	public setTriggerElement(trigger: HTMLElement): void {
		this.#trigger.set(trigger);
	}
	readonly #handleTriggerChange = (): void => {
		this.render();

		if (this.#openState.open) this.#overlay.setOpen(true);
	};
	readonly #commitOpen = (detail: { open: boolean }): void => {
		if (!detail.open) this.#overlay.setOpen(false);

		this.render();

		if (detail.open) this.#overlay.setOpen(true);
	};
}
