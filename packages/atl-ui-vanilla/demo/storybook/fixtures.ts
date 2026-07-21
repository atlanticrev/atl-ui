import type { AltAutocompleteOption, AltSelectOption, AltTableColumn } from '../../src';

export const channelOptions: readonly AltSelectOption[] = [
	{ description: 'Long-form public video', label: 'YouTube', value: 'youtube' },
	{ description: 'Short vertical video', label: 'TikTok', value: 'tiktok' },
	{ description: 'Photo and Reels', label: 'Instagram', value: 'instagram' },
	{ description: 'Unavailable account', disabled: true, label: 'LinkedIn', value: 'linkedin' },
];

export const toolOptions: readonly AltAutocompleteOption[] = [
	{ description: 'Design workspace', label: 'Figma', value: 'figma' },
	{ description: 'Issue tracking', label: 'Linear', value: 'linear' },
	{ description: 'Docs and notes', label: 'Notion', value: 'notion' },
	{ description: 'Team messaging', label: 'Slack', value: 'slack' },
];

export const longOption = {
	description: 'Long metadata must wrap: https://example.com/a/very/long/path/without/spaces',
	label: 'All-selected-channels-and-derived-publications-with-a-very-long-name',
	value: 'long-option',
};

export type ChannelRow = {
	audience: number;
	channel: string;
	status: string;
};

export const channelRows: readonly ChannelRow[] = [
	{ audience: 128400, channel: 'YouTube', status: 'Ready' },
	{ audience: 84200, channel: 'TikTok', status: 'Scheduled' },
	{ audience: 62100, channel: 'Instagram', status: 'Draft' },
	{ audience: 28400, channel: 'LinkedIn', status: 'Ready' },
];

export const channelColumns: readonly AltTableColumn<ChannelRow>[] = [
	{ dataIndex: 'channel', title: 'Channel' },
	{ dataIndex: 'status', title: 'Status' },
	{ align: 'right', dataIndex: 'audience', title: 'Audience' },
];
