import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';
import { setAltIcon } from '../../icons';

import type { AltCollapseChangeDetail } from './types';

const items = (host: HTMLElement): HTMLDetailsElement[] => {
	return Array.from(host.querySelectorAll<HTMLDetailsElement>(':scope > details'));
};

const itemKey = (item: HTMLDetailsElement, index: number): string => item.dataset.key || String(index);

const syncCollapseItem = (item: HTMLDetailsElement, index: number): void => {
	item.classList.add('alt-collapse__item');

	item.dataset.key ||= String(index);

	const summary = item.querySelector<HTMLElement>(':scope > summary');

	if (!summary) return;

	summary.classList.add('alt-collapse__summary');

	let indicator = summary.querySelector<HTMLElement>(':scope > [data-alt-owned="collapse-indicator"]');

	if (!indicator) {
		indicator = item.ownerDocument.createElement('span');

		indicator.className = 'alt-collapse__indicator';

		indicator.dataset.altOwned = 'collapse-indicator';

		indicator.setAttribute('aria-hidden', 'true');

		summary.append(indicator);
	}

	setAltIcon(indicator, item.open ? 'minus' : 'plus', { size: 20 });
};

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
			items(this).forEach(syncCollapseItem);
		}

		#handleToggle = (event: Event): void => {
			const changed = event.target as HTMLDetailsElement;

			if (!items(this).includes(changed)) return;

			if (this.single && changed.open) {
				for (const [index, item] of items(this).entries()) {
					if (item === changed) continue;

					item.open = false;

					syncCollapseItem(item, index);
				}
			}

			syncCollapseItem(changed, items(this).indexOf(changed));

			this.dispatchEvent(createTypedEvent<AltCollapseChangeDetail>('alt-change', { openKeys: this.openKeys }));
		};
	};
};
