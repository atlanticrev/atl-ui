import { AtlAvatar } from '@/components/avatar';
import { AtlButton } from '@/components/button';
import type { SimpleTableColumn } from '@/components/table/types';
import { DotsVerticalIcon } from '@/icons/dots-vertical-icon';

import type { ShowcaseFile } from './showcase-types';
import styles from './showcase-table-cells.module.scss';

const renderFileTitle = (record: ShowcaseFile): JSX.Element => (
	<div className={styles.fileCell}>
		<input
			aria-label={`Select ${record.title}`}
			className={styles.checkbox}
			type="checkbox"
		/>
		<div className={styles.fileIcon}>
			<record.icon size={18} />
		</div>
		<div className={styles.fileMeta}>
			<div className={styles.fileTitle}>{record.title}</div>
			<div className={styles.fileSubline}>{record.meta}</div>
		</div>
	</div>
);

const renderAuthor = (record: ShowcaseFile): JSX.Element => (
	<div className={styles.authorCell}>
		<AtlAvatar
			backgroundColor={record.author.accent}
			initials={record.author.initials}
			size={40}
		/>
		<div className={styles.authorMeta}>
			<div className={styles.authorName}>{record.author.name}</div>
			<div className={styles.authorEmail}>{record.author.email}</div>
		</div>
	</div>
);

const renderActions = (record: ShowcaseFile): JSX.Element => (
	<AtlButton
		aria-label={`Open actions for ${record.title}`}
		className={styles.rowMenu}
		iconLeft={<DotsVerticalIcon size={18} />}
		size={24}
		variant="text"
	/>
);

export const showcaseTableColumns: Array<SimpleTableColumn<ShowcaseFile>> = [
	{
		key: 'file',
		title: (
			<span className={styles.headerCell}>
				<input
					aria-label="Select all files"
					className={styles.checkbox}
					type="checkbox"
				/>
				<span className={styles.columnTitle}>File name</span>
			</span>
		),
		width: '52%',
		render: (_, record) => renderFileTitle(record),
	},
	{
		key: 'author',
		title: <span className={styles.columnTitle}>Uploaded by</span>,
		width: '24%',
		render: (_, record) => renderAuthor(record),
	},
	{
		key: 'modified',
		title: <span className={styles.columnTitle}>Last modified</span>,
		width: '16%',
		render: (_, record) => <span className={styles.modifiedAt}>{record.modifiedAt}</span>,
	},
	{
		key: 'actions',
		title: '',
		width: '8%',
		render: (_, record) => renderActions(record),
	},
];
