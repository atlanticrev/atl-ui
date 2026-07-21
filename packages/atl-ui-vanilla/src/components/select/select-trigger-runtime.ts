import {
	configureSelectTrigger,
	readSelectTriggerParts,
	type SelectDom,
} from './dom';
import { bindSelectTriggerInteractions, type SelectInteractionCallbacks } from './interactions';

export class SelectTriggerRuntime {
	#dom: SelectDom | undefined;
	#signal: AbortSignal | undefined;

	public constructor(
		private readonly host: HTMLElement,
		private readonly interactions: SelectInteractionCallbacks,
		private readonly onChange: () => void,
	) {}

	public get element(): HTMLElement | null {
		return this.#dom?.trigger ?? null;
	}

	public connect(dom: SelectDom, signal: AbortSignal): void {
		this.#dom = dom;
		this.#signal = signal;
	}

	public disconnect(): void {
		this.#signal = undefined;
	}

	public set(trigger: HTMLElement): void {
		trigger.dataset.altSelectTrigger = '';
		if (!this.#dom) {
			this.host.prepend(trigger);
			return;
		}
		if (trigger === this.#dom.trigger) return;
		this.#dom.trigger.replaceWith(trigger);
		this.#dom.trigger = trigger;
		Object.assign(this.#dom, readSelectTriggerParts(trigger));
		configureSelectTrigger(trigger, this.#dom.list.id);
		if (this.#signal) {
			bindSelectTriggerInteractions(this.host, trigger, this.interactions, this.#signal);
		}
		this.onChange();
	}
}
