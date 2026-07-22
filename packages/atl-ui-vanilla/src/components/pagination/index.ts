import { type ElementEnvironment, registerElement } from '../../core';

import { createAltPaginationElementClass } from './pagination-element';

export { createAltPaginationElementClass } from './pagination-element';
export { pageCount, paginationRange } from './pagination-range';
export type { AltPaginationChangeDetail, AltPaginationElementApi } from './types';

export const defineAltPagination = (environment?: ElementEnvironment): CustomElementConstructor | undefined => {
	return registerElement('alt-pagination', createAltPaginationElementClass, environment);
};
