import { bindFormReset } from '../../controllers';

import type { SelectDom } from './dom';
import type { SelectModel } from './model';

export class SelectFormRuntime {
	#cleanup: (() => void) | undefined;
	#signal: AbortSignal | undefined;

	public constructor(
		private readonly host: HTMLElement,
		private readonly model: SelectModel,
		private readonly render: () => void,
	) {}

	public connect(dom: SelectDom, signal: AbortSignal): void {
		this.#signal = signal;
		dom.carrier.addEventListener('invalid', (event) => this.#handleInvalid(event, dom), { signal });
		this.sync(dom);
	}

	public disconnect(): void {
		this.#cleanup?.();
		this.#cleanup = undefined;
		this.#signal = undefined;
	}

	public sync(dom: SelectDom): void {
		this.#cleanup?.();
		this.#cleanup = bindFormReset(dom.carrier, this.#handleReset, this.#signal);
	}

	#handleInvalid(event: Event, dom: SelectDom): void {
		event.preventDefault();
		if (this.host.getAttribute('aria-invalid') !== 'true') {
			this.host.dataset.validationInvalid = 'true';
			this.host.setAttribute('aria-invalid', 'true');
		}
		dom.trigger.setAttribute('aria-invalid', 'true');
		dom.trigger.focus();
	}

	#handleReset = (): void => {
		this.model.reset();
		this.render();
	};
}
