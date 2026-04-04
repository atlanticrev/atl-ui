import { useState } from 'react';

import { AtlButton } from '@/components/button';
import { AtlSimpleTable } from '@/components/table';

import { showcaseTableFiles } from './data';
import { showcaseTableColumns } from './showcase-table-columns';
import styles from './showcase-table.module.scss';
import { DesignSystemShowcaseTableToolbar } from './showcase-table-toolbar';

export const DesignSystemShowcaseTable = (): JSX.Element => {
	const [activeKey, setActiveKey] = useState('all');
	const [searchValue, setSearchValue] = useState('');

	return (
		<section className={styles.root}>
			<DesignSystemShowcaseTableToolbar
				activeKey={activeKey}
				searchValue={searchValue}
				onSearchValueChange={setSearchValue}
				onTabChange={setActiveKey}
			/>

			<AtlSimpleTable
				ariaLabel="All files"
				className={styles.table}
				columns={showcaseTableColumns}
				dataSource={showcaseTableFiles}
				rowKey="id"
			/>

			<div className={styles.pagination}>
				<div className={styles.pageNumbers}>
					<AtlButton
						size={32}
						variant="tonal"
					>
						1
					</AtlButton>

					<AtlButton
						size={32}
						variant="text"
					>
						2
					</AtlButton>

					<AtlButton
						size={32}
						variant="text"
					>
						3
					</AtlButton>

					<AtlButton
						size={32}
						variant="text"
					>
						4
					</AtlButton>
				</div>

				<AtlButton
					size={40}
					variant="outlined"
				>
					Next
				</AtlButton>
			</div>
		</section>
	);
};
