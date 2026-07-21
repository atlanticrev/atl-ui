import { replaceTableContent } from './table-content';
import type { TableDom } from './table-dom';
import type { TablePage } from './table-pagination';
import type { AltTableCell } from './types';

export const renderTableEmpty = (dom: TableDom, columnCount: number, content: AltTableCell, empty: boolean): void => {
	dom.empty.remove();
	if (!empty) return;
	const cell = dom.empty.cells[0] ?? dom.empty.insertCell();
	cell.className = 'alt-simple-table__empty';
	cell.colSpan = Math.max(columnCount, 1);
	replaceTableContent(cell, content ?? 'No data');
	dom.tbody.append(dom.empty);
};

export const renderTablePagination = (host: HTMLElement, dom: TableDom, page: TablePage, visible: boolean): void => {
	const tableLabel = host.getAttribute('aria-label') ?? 'Data table';
	dom.table.setAttribute('aria-label', tableLabel);
	dom.scroll.setAttribute('aria-label', `${tableLabel} scroll area`);
	dom.pagination.hidden = !visible || page.totalPages <= 1;
	dom.previous.disabled = page.current <= 1;
	dom.next.disabled = page.current >= page.totalPages;
	dom.previousLabel.textContent = host.getAttribute('previous-text') ?? 'Prev';
	dom.nextLabel.textContent = host.getAttribute('next-text') ?? 'Next';
	const icons = host as HTMLElement & { nextIcon?: Node | null; previousIcon?: Node | null };
	syncPaginationIcon(dom.previousIcon, icons.previousIcon ?? null);
	syncPaginationIcon(dom.nextIcon, icons.nextIcon ?? null);
};

const syncPaginationIcon = (container: HTMLElement, icon: Node | null): void => {
	container.hidden = !icon;
	if (icon && container.firstChild !== icon) container.replaceChildren(icon);
	if (!icon && container.childNodes.length > 0) container.replaceChildren();
};
