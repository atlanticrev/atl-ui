import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { getCollapseItemKey, getCollapseItems, syncCollapseItem } from './collapse-items';
import { CollapseMotionController } from './collapse-motion-controller';
import type { AltCollapseChangeDetail } from './types';

export const createAltCollapseElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltCollapseElement extends BaseElement {
		static observedAttributes = ['single'];
		#motion = new CollapseMotionController(this, () => this.#dispatchChange());

		get openKeys(): readonly string[] {
			return getCollapseItems(this).flatMap((item, index) =>
				item.open ? [getCollapseItemKey(item, index)] : [],
			);
		}
		set openKeys(values: readonly string[]) {
			const keys = new Set(values);

			this.#motion.cancel();

			getCollapseItems(this).forEach((item, index) => {
				item.open = keys.has(getCollapseItemKey(item, index));
			});
		}
		get single(): boolean {
			return this.hasAttribute('single');
		}
		set single(value: boolean) {
			this.toggleAttribute('single', value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['openKeys', 'single']);

			this.classList.add('alt-collapse');

			this.addEventListener('click', this.#handleClick, { capture: true, signal });

			this.addEventListener('toggle', this.#handleToggle, { capture: true, signal });

			const Observer = this.ownerDocument.defaultView?.MutationObserver;

			const observer = Observer ? new Observer(() => this.requestUpdate()) : undefined;

			observer?.observe(this, { childList: true });

			signal.addEventListener('abort', () => observer?.disconnect(), { once: true });
		}
		onDisconnected(): void {
			this.#motion.cancel();
		}

		update(): void {
			getCollapseItems(this).forEach((item, index) => {
				syncCollapseItem(item, index);
			});
		}

		#handleClick = (event: MouseEvent): void => {
			const summary = (event.target as Element | null)?.closest<HTMLElement>('summary');

			const item = summary?.parentElement as HTMLDetailsElement | null | undefined;

			if (item?.localName !== 'details' || !getCollapseItems(this).includes(item)) return;

			const interactive = (event.target as Element | null)?.closest('a, button, input, select, textarea');

			if (interactive && interactive !== summary) return;

			event.preventDefault();

			const open = !this.#motion.getOpen(item);

			if (this.single && open) {
				getCollapseItems(this).forEach((candidate) => {
					if (candidate !== item && this.#motion.getOpen(candidate)) {
						this.#motion.transition(candidate, false);
					}
				});
			}

			this.#motion.transition(item, open);
		};

		#handleToggle = (event: Event): void => {
			const changed = event.target as HTMLDetailsElement;

			if (!getCollapseItems(this).includes(changed)) return;

			if (this.#motion.isControlled(changed)) return;

			if (this.single && changed.open) {
				for (const [index, item] of getCollapseItems(this).entries()) {
					if (item === changed) continue;

					item.open = false;

					syncCollapseItem(item, index);
				}
			}

			syncCollapseItem(changed, getCollapseItems(this).indexOf(changed));

			this.#dispatchChange();
		};

		#dispatchChange(): void {
			this.dispatchEvent(createTypedEvent<AltCollapseChangeDetail>('alt-change', { openKeys: this.openKeys }));
		}
	};
};
