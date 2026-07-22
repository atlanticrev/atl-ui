import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import type { AltCollapseChangeDetail } from './types';

const items = (host: HTMLElement): HTMLDetailsElement[] => {
	return Array.from(host.querySelectorAll<HTMLDetailsElement>(':scope > details'));
};

const itemKey = (item: HTMLDetailsElement, index: number): string => item.dataset.key || String(index);

export const createAltCollapseElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltCollapseElement extends BaseElement {
		static observedAttributes = ['single'];

		get openKeys(): readonly string[] {
			return items(this).flatMap((item, index) => (item.open ? [itemKey(item, index)] : []));
		}
		set openKeys(values: readonly string[]) {
			const keys = new Set(values);

			items(this).forEach((item, index) => {
				item.open = keys.has(itemKey(item, index));
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

			this.addEventListener('toggle', this.#handleToggle, { capture: true, signal });

			const Observer = this.ownerDocument.defaultView?.MutationObserver;

			const observer = Observer ? new Observer(() => this.requestUpdate()) : undefined;

			observer?.observe(this, { childList: true });

			signal.addEventListener('abort', () => observer?.disconnect(), { once: true });
		}

		update(): void {
			items(this).forEach((item, index) => {
				item.classList.add('alt-collapse__item');

				item.dataset.key ||= String(index);

				item.querySelector(':scope > summary')?.classList.add('alt-collapse__summary');
			});
		}

		#handleToggle = (event: Event): void => {
			const changed = event.target as HTMLDetailsElement;

			if (!items(this).includes(changed)) return;

			if (this.single && changed.open) {
				for (const item of items(this)) if (item !== changed) item.open = false;
			}

			this.dispatchEvent(createTypedEvent<AltCollapseChangeDetail>('alt-change', { openKeys: this.openKeys }));
		};
	};
};
