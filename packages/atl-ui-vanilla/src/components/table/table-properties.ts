import { createBaseElementClass } from '../../core';

import type { TableDom } from './table-dom';
import type { TableRowView } from './table-rows';
import type { AltTableCell, AltTableColumn, AltTablePagination } from './types';

type TableRecord = Record<string, unknown>;

export const createTablePropertiesClass = (HtmlElementConstructor: typeof HTMLElement) => {
	const BaseElement = createBaseElementClass(HtmlElementConstructor);

	return class TablePropertiesElement extends BaseElement {
		columnViews = new Map<string, HTMLTableCellElement>();
		columnsValue: readonly AltTableColumn<TableRecord>[] = [];
		dataSourceValue: readonly TableRecord[] = [];
		emptyContentValue: AltTableCell = undefined;
		internalPage = 1;
		nextIconValue: Node | null = null;
		paginationValue: AltTablePagination | false = false;
		previousIconValue: Node | null = null;
		rowClassNameValue: string | ((record: TableRecord, index: number) => string) = '';
		rowKeyValue: string | ((record: TableRecord) => string) = '';
		rowViews = new Map<string, TableRowView>();
		tableDom: TableDom | undefined;

		get columns(): readonly AltTableColumn<TableRecord>[] {
			return this.columnsValue;
		}
		set columns(value: readonly AltTableColumn<TableRecord>[]) {
			this.columnsValue = value;

			this.requestUpdate();
		}
		get dataSource(): readonly TableRecord[] {
			return this.dataSourceValue;
		}
		set dataSource(value: readonly TableRecord[]) {
			this.dataSourceValue = value;

			this.requestUpdate();
		}
		get emptyContent(): AltTableCell {
			return this.emptyContentValue;
		}
		set emptyContent(value: AltTableCell) {
			this.emptyContentValue = value;

			this.requestUpdate();
		}
		get nextIcon(): Node | null {
			return this.nextIconValue;
		}
		set nextIcon(value: Node | null) {
			this.nextIconValue = value;

			this.requestUpdate();
		}
		get pagination(): AltTablePagination | false {
			return this.paginationValue;
		}
		set pagination(value: AltTablePagination | false) {
			this.paginationValue = value;

			this.internalPage = value ? (value.current ?? 1) : 1;

			this.requestUpdate();
		}
		get previousIcon(): Node | null {
			return this.previousIconValue;
		}
		set previousIcon(value: Node | null) {
			this.previousIconValue = value;

			this.requestUpdate();
		}
		get rowClassName(): string | ((record: TableRecord, index: number) => string) {
			return this.rowClassNameValue;
		}
		set rowClassName(value: string | ((record: TableRecord, index: number) => string)) {
			this.rowClassNameValue = value;

			this.requestUpdate();
		}
		get rowKey(): string | ((record: TableRecord) => string) {
			return this.rowKeyValue;
		}
		set rowKey(value: string | ((record: TableRecord) => string)) {
			this.rowKeyValue = value;

			this.requestUpdate();
		}
	};
};
