import type { AltTableCell } from './types';

export const replaceTableContent = (element: Element, content: AltTableCell): void => {
	const NodeConstructor = element.ownerDocument.defaultView?.Node;

	if (NodeConstructor && content instanceof NodeConstructor) {
		element.replaceChildren(content);

		return;
	}

	element.textContent = content === null || content === undefined ? '' : String(content);
};

export const resolveCellValue = <RecordType extends object>(
	record: RecordType,
	dataIndex: keyof RecordType | number | string | undefined,
): unknown => {
	if (dataIndex === undefined) return undefined;

	return (record as Record<PropertyKey, unknown>)[dataIndex];
};

export const resolveColumnKey = <RecordType extends object>(
	column: { dataIndex?: keyof RecordType | number | string; key?: number | string },
	index: number,
): string => String(column.key ?? column.dataIndex ?? index);
