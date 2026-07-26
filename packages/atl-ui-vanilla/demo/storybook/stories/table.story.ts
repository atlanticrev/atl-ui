import type { AltTableColumn, AltTableElementApi, AltTableRowClickDetail } from '../../../src';
import { createCustomIcon } from '../custom-icon';
import { findElement } from '../dom';
import { type ChannelRow, channelColumns, channelRows } from '../fixtures';
import { defineStory, example } from '../story-factory';

import { pinnedTableMarkup, setupPinnedTable } from './table-pinning-story';

const tables = `
<div class="alt-catalog-story-stack">
	<alt-table aria-label="Channel status table" data-basic-table></alt-table>
	<output data-row-output>Click a row to inspect its event.</output>
</div>`;

const advanced = `
<alt-table aria-label="Paginated channel table" data-advanced-table></alt-table>`;

const empty = `
<alt-table aria-label="Empty channel table" data-empty-table empty-text="No channels connected"></alt-table>`;

const formatAudience = (value: unknown): string => Number(value).toLocaleString('en-US');

const advancedColumns: readonly AltTableColumn<ChannelRow>[] = [
	{ dataIndex: 'channel', minWidth: 180, overflow: 'ellipsis', title: 'Channel', width: '40%' },
	{
		dataIndex: 'status',
		minWidth: 136,
		overflow: 'nowrap',
		title: 'Status',
		render: (value) => {
			const chip = document.createElement('span');

			const label = document.createElement('span');

			chip.className = 'alt-chip';

			chip.dataset.variant = value === 'Ready' ? 'frozen' : 'default';

			label.className = 'alt-chip__label';

			label.textContent = String(value);

			chip.append(label);

			return chip;
		},
	},
	{
		align: 'right',
		dataIndex: 'audience',
		minWidth: 120,
		overflow: 'nowrap',
		render: formatAudience,
		title: 'Audience',
	},
];

export const tableStory = defineStory({
	id: 'table',
	title: 'Table',
	group: 'Complex',
	summary: 'Managed native table with typed columns, custom cells, row events, empty state and pagination.',
	examples: [
		example('Data and row events', tables, 'Aligned columns and clickable rows.', true),
		example('Custom render and pagination', advanced, 'Rich cells with two rows per page.', true),
		example(
			'Long content and narrow container',
			'<div class="alt-catalog-stress-frame"><alt-table data-stress-table></alt-table></div>',
			'Columns scroll horizontally instead of overlapping.',
			true,
		),
		example(
			'Pinned columns',
			pinnedTableMarkup,
			'Multiple left columns and one right column stay visible during horizontal scrolling.',
			true,
		),
		example('Empty state', empty),
	],
	setup: (root) => {
		setupPinnedTable(root);

		const basic = findElement<AltTableElementApi<ChannelRow>>(root, '[data-basic-table]');

		basic.columns = channelColumns;

		basic.dataSource = channelRows.slice(0, 3);

		basic.rowKey = 'channel';

		basic.addEventListener('alt-row-click', (event) => {
			const detail = (event as CustomEvent<AltTableRowClickDetail<ChannelRow>>).detail;

			findElement<HTMLOutputElement>(root, '[data-row-output]').value = `Clicked ${detail.record.channel}`;
		});

		const stress = findElement<AltTableElementApi<ChannelRow>>(root, '[data-stress-table]');

		stress.columns = advancedColumns;

		stress.dataSource = [
			{
				audience: 84200,
				channel: 'Channel-with-an-extremely-long-unbroken-name',
				status: 'Scheduled',
			},
		];

		stress.rowKey = 'channel';

		const rich = findElement<AltTableElementApi<ChannelRow>>(root, '[data-advanced-table]');

		rich.columns = advancedColumns;

		rich.dataSource = channelRows;

		rich.pagination = { current: 1, pageSize: 2, total: channelRows.length };

		rich.nextIcon = createCustomIcon(document);

		rich.previousIcon = createCustomIcon(document);

		rich.rowKey = 'channel';
	},
});
