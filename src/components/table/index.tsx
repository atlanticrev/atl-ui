import { useMemo } from 'react';

import { AtlButton } from '@/components/button';
import { clsx } from '@/lib/clsx';

import type { AtlTableProps } from './types';

const DEFAULT_PAGE_SIZE = 10;

const resolveCellValue = <RecordType extends object>(record: RecordType, dataIndex?: string | number): unknown => {
	if (dataIndex === undefined) {
		return undefined;
	}

	return record[dataIndex as keyof RecordType];
};

export const AtlTable = <RecordType extends object>({ ariaLabel, className, columns = [], dataSource, locale, onRow, pagination = false, rowClassName, rowKey, style }: AtlTableProps<RecordType>): JSX.Element => {
	const paginationConfig = pagination || undefined;
	const pageSize = paginationConfig?.pageSize ? paginationConfig.pageSize : DEFAULT_PAGE_SIZE;
	const currentPage = paginationConfig?.current ? paginationConfig.current : 1;
	const total = paginationConfig?.total ? paginationConfig.total : dataSource?.length ?? 0;
	const pagedData = useMemo(() => {
		if (!paginationConfig || !dataSource) {
			return dataSource ?? [];
		}

		const start = (currentPage - 1) * pageSize;
		return dataSource.slice(start, start + pageSize);
	}, [currentPage, dataSource, pageSize, paginationConfig]);
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	return (
		<div className={clsx('atl-table', className)} style={style}>
			<table aria-label={ariaLabel} className="atl-table__table">
				<thead>
					<tr>
						{columns.map((column, index) => <th key={column.key ?? String(column.dataIndex ?? index)} style={{ textAlign: column.align, width: column.width }}>{typeof column.title === 'function' ? column.title({}) : column.title}</th>)}
					</tr>
				</thead>
				<tbody>
					{pagedData.length === 0 && <tr><td className="atl-table__empty" colSpan={Math.max(columns.length, 1)}>{locale?.emptyText ?? 'No data'}</td></tr>}
					{pagedData.map((record, index) => {
						const resolvedKey = typeof rowKey === 'function' ? rowKey(record) : typeof rowKey === 'string' ? String(record[rowKey as keyof RecordType]) : String(index);
						const rowProps = onRow?.(record, index) ?? {};
						const resolvedClassName = typeof rowClassName === 'function' ? rowClassName(record, index) : rowClassName;

						return (
							<tr {...rowProps} className={resolvedClassName} key={resolvedKey}>
								{columns.map((column, columnIndex) => {
									const value = resolveCellValue(record, column.dataIndex);
									const cell = column.render ? column.render(value, record, index) : String(value ?? '');

									return <td className={column.className} key={column.key ?? String(column.dataIndex ?? columnIndex)} style={{ textAlign: column.align }}>{cell}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			{paginationConfig && totalPages > 1 && (
				<div className="atl-table__pagination">
					<AtlButton disabled={currentPage <= 1} size={32} variant="outlined" onClick={() => paginationConfig.onChange?.(currentPage - 1, pageSize)}>Prev</AtlButton>
					<AtlButton disabled={currentPage >= totalPages} size={32} variant="outlined" onClick={() => paginationConfig.onChange?.(currentPage + 1, pageSize)}>Next</AtlButton>
				</div>
			)}
		</div>
	);
};
