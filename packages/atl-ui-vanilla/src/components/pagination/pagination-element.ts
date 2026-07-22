import { createBaseElementClass, createTypedEvent, upgradeProperties } from '../../core';
import { createAltIcon } from '../../icons';

import { pageCount, paginationRange } from './pagination-range';
import type { AltPaginationChangeDetail } from './types';

const positive = (value: string | null, fallback: number): number => {
	const parsed = Number(value);

	return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
};

export const createAltPaginationElementClass = (
	HtmlElementConstructor: typeof HTMLElement,
): CustomElementConstructor => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class AltPaginationElement extends BaseElement {
		static observedAttributes = ['aria-label', 'page', 'page-size', 'total'];
		#pageSizeOptions: readonly number[] = [];

		get page(): number {
			return positive(this.getAttribute('page'), 1);
		}
		set page(value: number) {
			this.setAttribute('page', String(value));
		}
		get pageSize(): number {
			return positive(this.getAttribute('page-size'), 10);
		}
		set pageSize(value: number) {
			this.setAttribute('page-size', String(value));
		}
		get pageSizeOptions(): readonly number[] {
			return this.#pageSizeOptions;
		}
		set pageSizeOptions(value: readonly number[]) {
			this.#pageSizeOptions = value.filter((item) => item > 0);

			this.requestUpdate();
		}

		get total(): number {
			return Math.max(0, Number(this.getAttribute('total')) || 0);
		}
		set total(value: number) {
			this.setAttribute('total', String(value));
		}

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, ['page', 'pageSize', 'pageSizeOptions', 'total']);

			this.classList.add('alt-pagination');

			this.addEventListener('click', this.#handleClick, { signal });

			this.addEventListener('change', this.#handleSize, { signal });
		}

		update(): void {
			const count = pageCount(this.total, this.pageSize);

			const current = Math.min(this.page, count);

			const document = this.ownerDocument;

			const nav = document.createElement('nav');

			const list = document.createElement('div');

			const previous = this.#button(current - 1, current === 1, 'Previous page', 'chevron-left');

			const next = this.#button(current + 1, current === count, 'Next page', 'chevron-right');

			nav.setAttribute('aria-label', this.getAttribute('aria-label') || 'Pagination');

			list.className = 'alt-pagination__pages';

			list.append(previous);

			for (const item of paginationRange(current, count)) {
				if (typeof item === 'string') {
					const ellipsis = document.createElement('span');

					ellipsis.className = 'alt-pagination__ellipsis';

					ellipsis.append(createAltIcon(document, 'more-horizontal', { size: 18 }));

					ellipsis.setAttribute('aria-hidden', 'true');

					list.append(ellipsis);
				} else {
					const page = this.#button(item, false, `Page ${item}`, String(item));

					if (item === current) page.setAttribute('aria-current', 'page');

					list.append(page);
				}
			}

			list.append(next);

			nav.append(list);

			if (this.#pageSizeOptions.length) nav.append(this.#sizeSelect());

			this.replaceChildren(nav);
		}

		#button(
			page: number,
			disabled: boolean,
			label: string,
			content: 'chevron-left' | 'chevron-right' | string,
		): HTMLButtonElement {
			const button = this.ownerDocument.createElement('button');

			button.type = 'button';

			button.className = 'alt-button alt-pagination__button';

			button.dataset.elevation = 'none';

			button.dataset.page = String(page);

			button.dataset.size = '32';

			button.dataset.variant = 'text';

			button.disabled = disabled;

			button.setAttribute('aria-label', label);

			if (content === 'chevron-left' || content === 'chevron-right') {
				button.dataset.iconOnly = '';

				button.append(createAltIcon(this.ownerDocument, content, { size: 18 }));
			} else {
				button.textContent = content;
			}

			return button;
		}

		#sizeSelect(): HTMLLabelElement {
			const label = this.ownerDocument.createElement('label');

			const select = this.ownerDocument.createElement('select');

			label.className = 'alt-pagination__size';

			label.append('Rows per page ', select);

			for (const size of this.#pageSizeOptions) {
				const option = this.ownerDocument.createElement('option');

				option.value = String(size);

				option.textContent = String(size);

				option.selected = size === this.pageSize;

				select.append(option);
			}

			return label;
		}

		#emit(): void {
			this.dispatchEvent(
				createTypedEvent<AltPaginationChangeDetail>('alt-change', { page: this.page, pageSize: this.pageSize }),
			);
		}
		#handleClick = (event: Event): void => {
			const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-page]');

			if (!button || button.disabled) return;

			this.page = Number(button.dataset.page);

			this.#emit();
		};

		#handleSize = (event: Event): void => {
			const select = (event.target as Element | null)?.closest<HTMLSelectElement>('.alt-pagination__size select');

			if (!select) return;

			this.pageSize = Number(select.value);

			this.page = 1;

			this.#emit();
		};
	};
};
