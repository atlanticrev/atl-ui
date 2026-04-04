import { AtlButton } from '@/components/button';
import { AtlInput } from '@/components/input/input';
import { AtlTabs } from '@/components/tabs';
import { ChevronDownIcon } from '@/icons/chevron-down-icon';
import { FilterLinesIcon } from '@/icons/filter-lines-icon';
import { SearchIcon } from '@/icons/search-icon';

import styles from './showcase-table-toolbar.module.scss';

type DesignSystemShowcaseTableToolbarProps = {
	activeKey: string;
	onSearchValueChange: (value: string) => void;
	onTabChange: (key: string) => void;
	searchValue: string;
};

const filterItems = [
	{ key: 'all', label: 'View all', children: null },
	{ key: 'documents', label: 'Documents', children: null },
	{ key: 'pdfs', label: 'PDFs', children: null },
	{ key: 'images', label: 'Images', children: null },
	{
		key: 'others',
		label: (
			<span className={styles.otherFilter}>
				Others
				<ChevronDownIcon size={16} />
			</span>
		),
		children: null,
	},
];

export const DesignSystemShowcaseTableToolbar = ({
	activeKey,
	onSearchValueChange,
	onTabChange,
	searchValue,
}: DesignSystemShowcaseTableToolbarProps): JSX.Element => {
	return (
		<div className={styles.header}>
			<h2 className={styles.title}>All files</h2>

			<div className={styles.toolbar}>
				<AtlTabs
					activeKey={activeKey}
					className={styles.tabs}
					contentClassName={styles.hidden}
					items={filterItems}
					onChange={onTabChange}
					testId="design-system-file-filters"
				/>

				<div className={styles.searchRow}>
					<AtlInput
						className={styles.search}
						iconLeft={<SearchIcon />}
						placeholder="Search"
						value={searchValue}
						onChange={onSearchValueChange}
					/>

					<AtlButton
						iconLeft={<FilterLinesIcon size={18} />}
						size={40}
						variant="outlined"
					>
						Filters
					</AtlButton>
				</div>
			</div>
		</div>
	);
};
