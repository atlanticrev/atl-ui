import type {
	AltPaginationChangeDetail,
	AltPaginationElementApi,
	AltSelectChangeDetail,
	AltSelectElementApi,
	AltTableElementApi,
} from '../../../src';
import { findElement } from '../dom';
import { channelColumns, channelRows, type ChannelRow } from '../fixtures';
import { example, defineStory } from '../story-factory';

export const paginationStory = defineStory({
	id: 'pagination',
	title: 'Pagination',
	group: 'Complex',
	summary: 'Responsive pagination with page-size options and composable table/select state.',
	examples: [
		example(
			'Pages',
			'<alt-pagination page="6" page-size="10" total="240"></alt-pagination>',
			'Ellipses keep long ranges compact.',
			true,
		),
		example(
			'Page size',
			'<alt-pagination data-size-pagination page-size="20" total="240"></alt-pagination>',
			'Optional native page-size control.',
			true,
		),
		example(
			'Table and Select composition',
			`<div class="alt-catalog-story-stack" data-pagination-composition>
	<alt-select data-page-size label="Rows per page" value="2"></alt-select>
	<alt-table aria-label="Externally paginated channels" data-page-table></alt-table>
	<alt-pagination aria-label="Channel pages" data-page-control page-size="2"></alt-pagination>
</div>`,
			'One state update drives the existing Select, Table and the new Pagination.',
			true,
		),
	],
	setup: (root) => {
		findElement<AltPaginationElementApi>(root, '[data-size-pagination]').pageSizeOptions = [10, 20, 50];

		const select = findElement<AltSelectElementApi>(root, '[data-page-size]');

		const table = findElement<AltTableElementApi<ChannelRow>>(root, '[data-page-table]');

		const pagination = findElement<AltPaginationElementApi>(root, '[data-page-control]');

		let page = 1;

		let pageSize = 2;

		select.options = [2, 3, 5].map((size) => ({ label: `${size} rows`, value: String(size) }));

		table.columns = channelColumns;

		table.pagination = false;

		table.rowKey = 'channel';

		pagination.total = channelRows.length;

		const render = (): void => {
			table.dataSource = channelRows.slice((page - 1) * pageSize, page * pageSize);

			pagination.page = page;

			pagination.pageSize = pageSize;
		};

		pagination.addEventListener('alt-change', (event) => {
			const detail = (event as CustomEvent<AltPaginationChangeDetail>).detail;

			page = detail.page;

			pageSize = detail.pageSize;

			render();
		});

		select.addEventListener('alt-change', (event) => {
			pageSize = Number((event as CustomEvent<AltSelectChangeDetail>).detail.value);

			page = 1;

			render();
		});

		render();
	},
});
