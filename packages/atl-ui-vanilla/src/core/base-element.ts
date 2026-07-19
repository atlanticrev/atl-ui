import { createMicrotaskBatch } from './batch';

type ElementState = {
	connectionController: AbortController | undefined;
	enqueueUpdate: () => void;
};

const elementStates = new WeakMap<HTMLElement, ElementState>();

export type AltElement = HTMLElement & {
	readonly connectionSignal: AbortSignal | undefined;
	connectedCallback(): void;
	disconnectedCallback(): void;
	onConnected(signal: AbortSignal): void;
	onDisconnected(): void;
	requestUpdate(): void;
	update(): void;
};

export type AltElementConstructor = new () => AltElement;

const createConnectionController = (element: HTMLElement): AbortController => {
	const documentWindow = element.ownerDocument.defaultView;
	const AbortControllerConstructor = documentWindow?.AbortController ?? globalThis.AbortController;

	return new AbortControllerConstructor();
};

export const createBaseElementClass = (HtmlElementConstructor?: typeof HTMLElement): AltElementConstructor => {
	const ResolvedHtmlElement = HtmlElementConstructor ?? globalThis.HTMLElement;

	if (typeof ResolvedHtmlElement !== 'function') {
		throw new Error('HTMLElement is unavailable. Create element classes only in a browser environment.');
	}

	return class AltElement extends ResolvedHtmlElement {
		public constructor() {
			super();
			elementStates.set(this, {
				connectionController: undefined,
				enqueueUpdate: createMicrotaskBatch(() => {
					const controller = elementStates.get(this)?.connectionController;

					if (controller && !controller.signal.aborted && this.isConnected) {
						this.update();
					}
				}),
			});
		}

		public get connectionSignal(): AbortSignal | undefined {
			return elementStates.get(this)?.connectionController?.signal;
		}

		public connectedCallback(): void {
			const state = elementStates.get(this);

			if (!state || (state.connectionController && !state.connectionController.signal.aborted)) {
				return;
			}

			const controller = createConnectionController(this);
			state.connectionController = controller;

			try {
				this.onConnected(controller.signal);
				this.requestUpdate();
			} catch (error) {
				state.connectionController = undefined;
				controller.abort();
				throw error;
			}
		}

		public disconnectedCallback(): void {
			const state = elementStates.get(this);
			const controller = state?.connectionController;

			if (!controller) {
				return;
			}

			state.connectionController = undefined;
			controller.abort();
			this.onDisconnected();
		}

		public onConnected(signal: AbortSignal): void {
			void signal;
		}

		public onDisconnected(): void {}

		public requestUpdate(): void {
			elementStates.get(this)?.enqueueUpdate();
		}

		public update(): void {}
	};
};
