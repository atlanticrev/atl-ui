import { AtlSidebar } from '@/components/sidebar';
import { ChevronRightIcon } from '@/icons/chevron-right-icon';
import { FolderLineIcon } from '@/icons/folder-line-icon';

import { showcaseFolders, showcaseNavigationItems } from './data';
import styles from './showcase-sidebar.module.scss';
import footerStyles from './showcase-sidebar-footer.module.scss';

export const DesignSystemShowcaseSidebar = (): JSX.Element => {
	const header = (
		<div className={styles.brand}>
			<div className={styles.logoMark}>
				<span className={styles.logoDot} />
				<span className={styles.logoLine} />
			</div>
			<div className={styles.brandText}>Untitled UI</div>
		</div>
	);

	const footer = (
		<div className={footerStyles.footer}>
			<div className={footerStyles.footerHeader}>
				<span className={footerStyles.footerLabel}>File browser</span>
				<span className={footerStyles.footerDots}>⋮</span>
			</div>

			<div className={footerStyles.folderList}>
				{showcaseFolders.map((folder) => (
					<div
						className={footerStyles.folderItem}
						key={folder}
					>
						<ChevronRightIcon
							className={footerStyles.folderChevron}
							size={16}
						/>
						<FolderLineIcon size={18} />
						<span className={footerStyles.folderText}>{folder}</span>
					</div>
				))}
			</div>

			<div className={footerStyles.storageCard}>
				<div className={footerStyles.storageTitle}>Storage</div>
				<div className={footerStyles.storageTrack}>
					<span className={footerStyles.storageFill} />
				</div>
				<div className={footerStyles.storageMeta}>14.4 GB of 20 GB used (72%)</div>
			</div>
		</div>
	);

	return (
		<AtlSidebar
			className={styles.sidebar}
			footer={footer}
			header={header}
			items={showcaseNavigationItems.map((item) => ({
				key: item.key,
				label: item.label,
				icon: <item.icon size={20} />,
			}))}
			selectedKey="files"
			testId="design-system-sidebar"
		/>
	);
};
