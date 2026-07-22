import { createBaseElementClass, createTypedEvent, upgradeProperty } from '../../core';

import type { AltMenuSelectDetail } from './types';

const getParts = (
	host: HTMLElement,
): { items: HTMLElement[]; menu: HTMLElement | null; trigger: HTMLElement | null } => {
	const menu = host.querySelector<HTMLElement>(':scope > [role="menu"]');

	const trigger = host.querySelector<HTMLElement>(':scope > [data-alt-menu-trigger]');

	const items = menu
		? Array.from(menu.querySelectorAll<HTMLElement>('[role^="menuitem"]')).filter(
				(item) => !item.hasAttribute('disabled') && item.getAttribute('aria-disabled') !== 'true',
			)
		: [];

	return { items, menu, trigger };
};

let menuId = 0;

export const createAltMenuElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltMenuElement extends BaseElement {
		static observedAttributes = ['open'];

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

			this.addEventListener('click', this.#handleClick, { signal });

			this.addEventListener('keydown', this.#handleKeydown, { signal });

			this.ownerDocument.addEventListener('pointerdown', this.#handleOutsidePointer, { capture: true, signal });

			const Observer = this.ownerDocument.defaultView?.MutationObserver;

			const observer = Observer ? new Observer(() => this.requestUpdate()) : undefined;

			observer?.observe(this, { childList: true, subtree: true });

			signal.addEventListener('abort', () => observer?.disconnect(), { once: true });
		}

		update(): void {
			const { items, menu, trigger } = getParts(this);

			if (!menu || !trigger) return;

			menu.id ||= `${this.id || `alt-menu-${++menuId}`}-popup`;

			menu.hidden = !this.open;

			trigger.setAttribute('aria-controls', menu.id);

			trigger.setAttribute('aria-expanded', String(this.open));

			trigger.setAttribute('aria-haspopup', 'menu');

			items.forEach((item) => {
				item.tabIndex = -1;
			});
		}

		#focus(edge: 'end' | 'start' = 'start'): void {
			const { items } = getParts(this);

			items[edge === 'start' ? 0 : items.length - 1]?.focus();
		}

		#handleClick = (event: Event): void => {
			const target = event.target as Element | null;

			const { items, trigger } = getParts(this);

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
			const { items, menu, trigger } = getParts(this);

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

			let index = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : current;

			if (event.key === 'ArrowDown') index = (current + 1) % items.length;

			if (event.key === 'ArrowUp') index = (current - 1 + items.length) % items.length;

			if (index !== current) {
				event.preventDefault();

				items[index]?.focus();
			}
		};

		#handleOutsidePointer = (event: Event): void => {
			if (this.open && !this.contains(event.target as Node)) this.open = false;
		};
	};
};
