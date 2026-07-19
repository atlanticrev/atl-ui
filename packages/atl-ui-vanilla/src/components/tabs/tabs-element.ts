import { createBaseElementClass, createTypedEvent, upgradeProperty } from '../../core';

import { collectTabsDom, isTabDisabled, type TabsDom } from './tabs-dom';
import { findInitialKey, getKeyboardTab, syncTabsState } from './tabs-state';
import type { AltTabsChangeDetail } from './types';

export const createAltTabsElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltTabsElement extends BaseElement {
		static observedAttributes = ['active-key'];
		#dom: TabsDom | undefined;

		get activeKey(): string | null {
			return this.getAttribute('active-key');
		}

		set activeKey(value: string | null) {
			if (value === null) {
				this.removeAttribute('active-key');
			} else {
				this.setAttribute('active-key', value);
			}
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperty(this, 'activeKey');
			this.classList.add('alt-tabs');
			this.addEventListener('click', this.#handleClick, {
				signal,
			});
			this.addEventListener('keydown', this.#handleKeydown, {
				signal,
			});
			const Observer = this.ownerDocument.defaultView?.MutationObserver;
			const observer = Observer ? new Observer(this.requestUpdate.bind(this)) : undefined;
			observer?.observe(this, {
				attributeFilter: ['aria-disabled', 'data-key', 'disabled'],
				attributes: true,
				childList: true,
				subtree: true,
			});
			signal.addEventListener('abort', () => observer?.disconnect(), {
				once: true,
			});
		}

		update(): void {
			this.#dom = collectTabsDom(this);

			if (!this.#dom) {
				return;
			}

			const activeKey = findInitialKey(this.#dom, this.activeKey);
			this.#dom.tabList.setAttribute('aria-orientation', this.dataset.orientation ?? 'horizontal');
			syncTabsState(this.#dom, activeKey);

			if (activeKey !== this.activeKey) {
				this.activeKey = activeKey;
			}
		}

		#activate(tab: HTMLElement, focus: boolean): void {
			if (isTabDisabled(tab)) {
				return;
			}

			const previousKey = this.activeKey;
			const activeKey = tab.dataset.key ?? null;

			if (!activeKey || activeKey === previousKey) {
				if (focus) tab.focus();
				return;
			}

			this.activeKey = activeKey;
			if (focus) tab.focus();
			this.dispatchEvent(
				createTypedEvent<AltTabsChangeDetail>('alt-change', {
					activeKey,
					previousKey,
				}),
			);
		}

		#findEventTab(event: Event): HTMLElement | undefined {
			const target = event.target as Element | null;
			const tab = target?.closest?.<HTMLElement>('[role="tab"]');
			return tab && this.#dom?.tabs.includes(tab) ? tab : undefined;
		}

		#handleClick = (event: Event): void => {
			const tab = this.#findEventTab(event);
			if (tab) this.#activate(tab, false);
		};
		#handleKeydown = (event: KeyboardEvent): void => {
			const tab = this.#findEventTab(event);
			if (!tab || !this.#dom) return;
			const orientation = this.dataset.orientation ?? 'horizontal';
			const next = getKeyboardTab(this.#dom, tab, event.key, orientation);
			if (!next) return;
			event.preventDefault();
			this.#activate(next, true);
		};
	};
};
