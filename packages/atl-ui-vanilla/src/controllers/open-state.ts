import { createTypedEvent } from '../core';

export type OpenChangeReason =
	| 'escape'
	| 'focus'
	| 'input'
	| 'outside'
	| 'programmatic'
	| 'selection'
	| 'trigger';

export type OpenChangeDetail = {
	open: boolean;
	reason: OpenChangeReason;
	sourceEvent?: Event;
};

export type OpenStateOptions = {
	isDisabled?: () => boolean;
	onCommit: (detail: OpenChangeDetail) => void;
};

export class OpenStateController {
	#open: boolean;
	#reflecting = false;

	public constructor(
		private readonly host: HTMLElement,
		private readonly options: OpenStateOptions,
	) {
		this.#open = host.hasAttribute('open');
	}

	public get open(): boolean {
		return this.#open;
	}

	public get reflecting(): boolean {
		return this.#reflecting;
	}

	public request(open: boolean, reason: OpenChangeReason, sourceEvent?: Event): boolean {
		const nextOpen = open && !this.options.isDisabled?.();

		if (nextOpen === this.#open) {
			return false;
		}

		const detail: OpenChangeDetail = {
			open: nextOpen,
			reason,
			sourceEvent,
		};
		const before = createTypedEvent('alt-before-open-change', detail, { cancelable: true });

		if (this.host.isConnected && !this.host.dispatchEvent(before)) {
			this.#restoreAttribute();
			return false;
		}

		this.#open = nextOpen;
		this.#restoreAttribute();
		this.options.onCommit(detail);

		if (this.host.isConnected) {
			this.host.dispatchEvent(createTypedEvent('alt-open-change', detail));
		}

		return true;
	}

	public syncAttribute(open: boolean): void {
		if (!this.#reflecting) {
			this.request(open, 'programmatic');
		}
	}

	#restoreAttribute(): void {
		this.#reflecting = true;
		this.host.toggleAttribute('open', this.#open);
		this.#reflecting = false;
	}
}
