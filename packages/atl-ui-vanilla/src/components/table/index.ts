import { type ElementEnvironment, registerElement } from '../../core';

import { createAltTableElementClass } from './table-element';

export { createAltTableElementClass } from './table-element';
export type {
	AltTableCell,
	AltTableCellOverflow,
	AltTableColumn,
	AltTableColumnFixed,
	AltTableElementApi,
	AltTablePageChangeDetail,
	AltTablePagination,
	AltTableRowClickDetail,
} from './types';

export const defineAltTable = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-table', createAltTableElementClass, environment);
};
