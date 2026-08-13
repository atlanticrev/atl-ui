import { getCollapseItems, syncCollapseItem } from './collapse-items';
import { createCollapseMotion } from './collapse-motion';

type CollapseMotion = { animation: Animation; open: boolean };

export class CollapseMotionController {
	#controlledToggles = new WeakSet<HTMLDetailsElement>();
	#motions = new Map<HTMLDetailsElement, CollapseMotion>();

	constructor(
		private readonly host: HTMLElement,
		private readonly onSettled: () => void,
	) {}

	getOpen(item: HTMLDetailsElement): boolean {
		return this.#motions.get(item)?.open ?? item.open;
	}

	isControlled(item: HTMLDetailsElement): boolean {
		return this.#controlledToggles.has(item) || this.#motions.has(item);
	}

	transition(item: HTMLDetailsElement, open: boolean): void {
		const startHeight = item.getBoundingClientRect().height;

		this.#motions.get(item)?.animation.cancel();

		this.#motions.delete(item);

		delete item.dataset.altCollapseAnimating;

		if (open) this.#setControlledOpen(item, true);

		const animation = createCollapseMotion(item, open, startHeight);

		if (!animation) {
			this.#setControlledOpen(item, open);

			syncCollapseItem(item, getCollapseItems(this.host).indexOf(item));

			this.onSettled();

			return;
		}

		this.#motions.set(item, { animation, open });

		syncCollapseItem(item, getCollapseItems(this.host).indexOf(item), open);

		const finishMotion = (): void => this.#finish(item, animation, open);

		const ignoreCancellation = (): void => undefined;

		animation.finished.then(finishMotion, ignoreCancellation);
	}

	cancel(): void {
		this.#motions.forEach(({ animation, open }, item) => {
			animation.cancel();

			delete item.dataset.altCollapseAnimating;

			item.open = open;

			syncCollapseItem(item, getCollapseItems(this.host).indexOf(item));
		});

		this.#motions.clear();
	}

	#finish(item: HTMLDetailsElement, animation: Animation, open: boolean): void {
		if (this.#motions.get(item)?.animation !== animation) return;

		this.#motions.delete(item);

		animation.cancel();

		delete item.dataset.altCollapseAnimating;

		this.#setControlledOpen(item, open);

		syncCollapseItem(item, getCollapseItems(this.host).indexOf(item));

		this.onSettled();
	}

	#setControlledOpen(item: HTMLDetailsElement, open: boolean): void {
		this.#controlledToggles.add(item);

		item.open = open;

		const clearControlledToggle = (): void => {
			this.#controlledToggles.delete(item);
		};

		this.host.ownerDocument.defaultView?.setTimeout(clearControlledToggle, 0);
	}
}
