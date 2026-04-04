import { AtlButton } from '@/components/button';
import { AtlCard } from '@/components/card';
import { DotsVerticalIcon } from '@/icons/dots-vertical-icon';
import { PlusIcon } from '@/icons/plus-icon';

import { showcaseQuickActions, showcaseRecentFiles } from './data';
import styles from './showcase-actions.module.scss';

export const DesignSystemShowcaseActions = (): JSX.Element => {
	return (
		<div className={styles.root}>
			<div className={styles.breadcrumbs}>
				<span>Untitled UI</span>

				<span className={styles.separator}>/</span>

				<strong>All files</strong>
			</div>

			<section className={styles.section}>
				<div className={styles.quickActions}>
					{showcaseQuickActions.map((action) => (
						<AtlCard
							as="button"
							className={styles.actionCard}
							key={action.key}
							type="button"
						>
							<div className={styles.actionIcon}>
								<action.icon size={18} />
							</div>

							<div className={styles.actionTitle}>{action.title}</div>

							<PlusIcon
								className={styles.actionPlus}
								size={18}
							/>
						</AtlCard>
					))}
				</div>
			</section>

			<section className={styles.section}>
				<h2 className={styles.sectionTitle}>Recent</h2>

				<div className={styles.recentGrid}>
					{showcaseRecentFiles.map((file) => (
						<AtlCard
							className={styles.recentCard}
							key={file.key}
						>
							<div className={styles.recentIcon}>
								<file.icon size={18} />
							</div>

							<div className={styles.recentBody}>
								<div className={styles.recentTitle}>{file.title}</div>

								<div className={styles.recentMeta}>{file.meta}</div>
							</div>

							<AtlButton
								aria-label={`Open actions for ${file.title}`}
								className={styles.menuButton}
								iconLeft={<DotsVerticalIcon size={18} />}
								size={24}
								variant="text"
							/>
						</AtlCard>
					))}
				</div>
			</section>
		</div>
	);
};
