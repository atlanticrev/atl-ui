import { createBaseElementClass, createTypedEvent, upgradeProperty } from '../../core';

import { configureMenuParts, getMenuNavigationIndex, getMenuParts } from './menu-dom';
import { bindMenuOverlay } from './menu-overlay';
import type { AltMenuSelectDetail } from './types';

let menuId = 0;

export const createAltMenuElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltMenuElement extends BaseElement {
		static observedAttributes = ['open'];
		#menu: HTMLElement | undefined;
		#overlayCleanup: (() => void) | undefined;
		#trigger: HTMLElement | undefined;

		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperty(this, 'open');

			this.classList.add('alt-menu');

			const Observer = this.ownerDocument.defaultView?.MutationObserver;

			const observer = Observer ? new Observer(() => this.requestUpdate()) : undefined;

			observer?.observe(this, { childList: true, subtree: true });

			signal.addEventListener('abort', () => observer?.disconnect(), {
				once: true,
			});
		}

		onDisconnected(): void {
			this.#cleanupOverlay();
		}

		update(): void {
			const { items, menu, trigger } = getMenuParts(this, this.#menu);

			if (!menu || !trigger) return;

			if ((this.#menu && this.#menu !== menu) || (this.#trigger && this.#trigger !== trigger)) {
				this.#cleanupOverlay();
			}

			this.#menu = menu;

			this.#trigger = trigger;

			configureMenuParts(menu, trigger, items, this.open, menu.id || this.id || `alt-menu-${++menuId}`);

			const signal = this.connectionSignal;

			if (signal) {
				trigger.addEventListener('click', this.#handleClick, {
					signal,
				});

				trigger.addEventListener('keydown', this.#handleKeydown, {
					signal,
				});

				menu.addEventListener('click', this.#handleClick, { signal });

				menu.addEventListener('keydown', this.#handleKeydown, {
					signal,
				});
			}

			if (this.open && !this.#overlayCleanup && signal) {
				this.#overlayCleanup = bindMenuOverlay(trigger, menu, this.#handleOverlayDismiss, signal);
			} else if (!this.open) this.#cleanupOverlay();
		}

		#focus(edge: 'end' | 'start' = 'start'): void {
			const { items } = getMenuParts(this, this.#menu);

			items[edge === 'start' ? 0 : items.length - 1]?.focus();
		}

		#handleClick = (event: Event): void => {
			const target = event.target as Element | null;

			const { items, trigger } = getMenuParts(this, this.#menu);

			if (trigger && (target === trigger || trigger.contains(target))) {
				this.open = !this.open;

				if (this.open) queueMicrotask(() => this.#focus());

				return;
			}

			const item = target?.closest<HTMLElement>('[role^="menuitem"]');

			if (!item || !items.includes(item)) return;

			this.dispatchEvent(
				createTypedEvent<AltMenuSelectDetail>('alt-select', {
					item,
					value: item.dataset.value || item.textContent?.trim() || '',
				}),
			);

			this.open = false;

			trigger?.focus();
		};

		#handleKeydown = (event: KeyboardEvent): void => {
			const { items, menu, trigger } = getMenuParts(this, this.#menu);

			if (!menu || !trigger) return;

			if (event.target === trigger && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
				event.preventDefault();

				this.open = true;

				queueMicrotask(() => this.#focus(event.key === 'ArrowUp' ? 'end' : 'start'));

				return;
			}

			if (!menu.contains(event.target as Node)) return;

			if (event.key === 'Escape') {
				event.preventDefault();

				this.open = false;

				trigger.focus();

				return;
			}

			const current = items.indexOf(event.target as HTMLElement);

			const index = getMenuNavigationIndex(event.key, current, items.length);

			if (index !== current) {
				event.preventDefault();

				items[index]?.focus();
			}
		};

		#handleOverlayDismiss = ({ reason }: { reason: 'escape' | 'outside-pointer' }): void => {
			this.open = false;

			if (reason === 'escape') this.#trigger?.focus();
		};
		#cleanupOverlay(): void {
			this.#overlayCleanup?.();

			this.#overlayCleanup = undefined;
		}
	};
};
