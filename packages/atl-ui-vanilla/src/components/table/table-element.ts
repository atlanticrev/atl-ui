import { createTypedEvent, upgradeProperties } from '../../core';

import { syncTableColumns } from './table-columns';
import { createTableDom } from './table-dom';
import { resolveTablePage, sliceTablePage } from './table-pagination';
import { createTablePropertiesClass } from './table-properties';
import { renderTableEmpty, renderTablePagination } from './table-render';
import { syncTableRows } from './table-rows';
import type { AltTablePageChangeDetail, AltTableRowClickDetail } from './types';

type TableRecord = Record<string, unknown>;

export const createAltTableElementClass = (HtmlElementConstructor: typeof HTMLElement): CustomElementConstructor => {
	const TablePropertiesElement = createTablePropertiesClass(HtmlElementConstructor);

	return class AltTableElement extends TablePropertiesElement {
		static observedAttributes = ['aria-label', 'empty-text', 'next-text', 'previous-text'];
		#renderedRows = new Map<string, { index: number; record: TableRecord }>();

		attributeChangedCallback(): void {
			this.requestUpdate();
		}

		onConnected(signal: AbortSignal): void {
			upgradeProperties(this, [
				'columns',
				'dataSource',
				'emptyContent',
				'nextIcon',
				'pagination',
				'previousIcon',
				'rowClassName',
				'rowKey',
			]);

			this.classList.add('alt-simple-table');

			this.tableDom ??= createTableDom(this);

			this.tableDom.previous.addEventListener('click', () => this.#changePage(-1), { signal });

			this.tableDom.next.addEventListener('click', () => this.#changePage(1), { signal });

			this.tableDom.tbody.addEventListener('click', this.#handleRowClick, { signal });
		}

		update(): void {
			if (!this.tableDom) return;

			const page = resolveTablePage(this.dataSourceValue.length, this.paginationValue, this.internalPage);

			const records = sliceTablePage(this.dataSourceValue, this.paginationValue, page);

			syncTableColumns(this.tableDom.thead, this.columnsValue, this.columnViews);

			this.#renderedRows = syncTableRows(this.tableDom.tbody, this.rowViews, {
				columns: this.columnsValue,
				getClassName: this.#getRowClassName,
				getKey: this.#getRowKey,
				records,
			});

			renderTableEmpty(
				this.tableDom,
				this.columnsValue.length,
				this.emptyContentValue ?? this.getAttribute('empty-text') ?? 'No data',
				records.length === 0,
			);

			renderTablePagination(this, this.tableDom, page, this.paginationValue !== false);
		}

		#changePage(direction: 1 | -1): void {
			const page = resolveTablePage(this.dataSourceValue.length, this.paginationValue, this.internalPage);

			const nextPage = Math.min(Math.max(1, page.current + direction), page.totalPages);

			if (nextPage === page.current) return;

			if (this.paginationValue && this.paginationValue.current === undefined) this.internalPage = nextPage;

			this.dispatchEvent(
				createTypedEvent<AltTablePageChangeDetail>('alt-page-change', {
					page: nextPage,
					pageSize: page.pageSize,
				}),
			);

			this.requestUpdate();
		}

		#getRowClassName = (record: TableRecord, index: number): string =>
			typeof this.rowClassNameValue === 'function'
				? this.rowClassNameValue(record, index)
				: this.rowClassNameValue;

		#getRowKey = (record: TableRecord, index: number): string =>
			typeof this.rowKeyValue === 'function'
				? this.rowKeyValue(record)
				: this.rowKeyValue
					? String(record[this.rowKeyValue])
					: String(index);

		#handleRowClick = (event: Event): void => {
			const row = (event.target as Element | null)?.closest<HTMLTableRowElement>('tr[data-key]');

			const item = row?.dataset.key ? this.#renderedRows.get(row.dataset.key) : undefined;

			if (!row?.dataset.key || !item) return;

			this.dispatchEvent(
				createTypedEvent<AltTableRowClickDetail>('alt-row-click', {
					index: item.index,
					key: row.dataset.key,
					record: item.record,
				}),
			);
		};
	};
};
