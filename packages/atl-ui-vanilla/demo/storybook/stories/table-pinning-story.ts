import type { AltTableColumn, AltTableElementApi } from '../../../src';
import { findElement } from '../dom';
import { type ChannelRow, channelRows } from '../fixtures';

export const pinnedTableMarkup = `
<div class="alt-catalog-stress-frame" style="--alt-catalog-stress-width: 520px">
	<alt-table aria-label="Pinned channel table" data-pinned-table></alt-table>
</div>`;

const pinnedColumns: readonly AltTableColumn<ChannelRow>[] = [
	{
		dataIndex: 'channel',
		fixed: 'left',
		minWidth: 120,
		overflow: 'ellipsis',
		title: 'Channel',
		width: 120,
	},
	{ dataIndex: 'status', fixed: 'left', minWidth: 100, overflow: 'nowrap', title: 'Status', width: 100 },
	{ align: 'right', dataIndex: 'audience', minWidth: 300, title: 'Audience', width: 300 },
	{
		dataIndex: 'channel',
		fixed: 'right',
		key: 'preview',
		overflow: 'ellipsis',
		title: 'Preview',
		width: 96,
	},
];

export const setupPinnedTable = (root: HTMLElement): void => {
	const table = findElement<AltTableElementApi<ChannelRow>>(root, '[data-pinned-table]');

	table.columns = pinnedColumns;

	table.dataSource = channelRows;

	table.rowKey = 'channel';
};
