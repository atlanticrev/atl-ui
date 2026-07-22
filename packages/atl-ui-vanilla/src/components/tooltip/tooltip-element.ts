import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';

import { createTooltipDom, findTooltipTrigger, type TooltipDom } from './tooltip-dom';
import { isTooltipTriggerOverflowing } from './tooltip-overflow';
import { bindTooltipOverlay } from './tooltip-overlay';
import type { AltTooltipOpenChangeDetail, AltTooltipPlacement, AltTooltipTrigger } from './types';

export const createAltTooltipElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltTooltipElement extends BaseElement {
		static observedAttributes = ['open', 'placement', 'title', 'trigger'];
		#cleanup: (() => void) | undefined;
		#content: Node | null = null;
		#dom: TooltipDom | undefined;
		#renderedOpen = false;

		get content(): Node | null {
			return this.#content;
		}
		set content(value: Node | null) {
			this.#content = value;

			this.requestUpdate();
		}
		get open(): boolean {
			return this.hasAttribute('open');
		}
		set open(value: boolean) {
			this.toggleAttribute('open', value);
		}
		get placement(): AltTooltipPlacement {
			const value = this.getAttribute('placement');
			return value === 'bottom' || value === 'left' || value === 'right' ? value : 'top';
		}
		set placement(value: AltTooltipPlacement) {
			this.setAttribute('placement', value);
		}
		get trigger(): AltTooltipTrigger {
			return this.getAttribute('trigger') === 'click' ? 'click' : 'hover';
		}
		set trigger(value: AltTooltipTrigger) {
			this.setAttribute('trigger', value);
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['content', 'open', 'placement', 'trigger']);

			this.classList.add('alt-tooltip');

			this.#dom ??= createTooltipDom(this);

			this.addEventListener('click', this.#handleClick, { signal });

			this.addEventListener('focusin', this.#handleEnter, { signal });

			this.addEventListener('focusout', this.#handleLeave, { signal });

			this.addEventListener('pointerenter', this.#handleEnter, { signal });

			this.addEventListener('pointerleave', this.#handleLeave, { signal });
		}

		onDisconnected(): void {
			this.#cleanupOverlay();
		}

		update(): void {
			if (!this.#dom) return;

			const trigger = findTooltipTrigger(this, this.#dom.panel);

			this.#dom.panel.className = `alt-tooltip__panel alt-tooltip__panel--${this.placement}`;

			if (this.#content) this.#dom.panel.replaceChildren(this.#content);
			else this.#dom.panel.textContent = this.getAttribute('title') ?? '';

			this.#dom.panel.hidden = !this.open;

			trigger?.setAttribute('aria-describedby', this.#dom.panel.id);

			this.#cleanupOverlay();

			if (this.open && trigger && this.connectionSignal) this.#bindOverlay(trigger, this.connectionSignal);

			if (this.#renderedOpen !== this.open) {
				this.#renderedOpen = this.open;

				this.dispatchEvent(
					createTypedEvent<AltTooltipOpenChangeDetail>('alt-open-change', { open: this.open }),
				);
			}
		}

		#bindOverlay(trigger: HTMLElement, signal: AbortSignal): void {
			if (!this.#dom) return;

			this.#cleanup = bindTooltipOverlay({
				onDismiss: () => {
					this.open = false;
				},
				panel: this.#dom.panel,
				placement: this.placement,
				signal,
				trigger: this.trigger,
				triggerElement: trigger,
			});
		}

		#handleClick = (event: Event): void => {
			if (this.trigger !== 'click' || event.target === this.#dom?.panel) return;

			if (!this.#canOpen()) return;

			this.open = !this.open;
		};
		#handleEnter = (): void => {
			if (this.trigger === 'hover' && this.#canOpen()) this.open = true;
		};
		#handleLeave = (event: FocusEvent | PointerEvent): void => {
			if (this.trigger !== 'hover' || (event.relatedTarget instanceof Node && this.contains(event.relatedTarget)))
				return;

			this.open = false;
		};
		#canOpen(): boolean {
			const trigger = this.#dom ? findTooltipTrigger(this, this.#dom.panel) : null;
			return !this.hasAttribute('show-on-overflow') || Boolean(trigger && isTooltipTriggerOverflowing(trigger));
		}
		#cleanupOverlay(): void {
			this.#cleanup?.();

			this.#cleanup = undefined;
		}
	};
};
