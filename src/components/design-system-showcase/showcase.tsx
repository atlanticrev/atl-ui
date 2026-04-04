import { DesignSystemShowcaseActions } from './showcase-actions';
import { DesignSystemShowcaseSidebar } from './showcase-sidebar';
import { DesignSystemShowcaseTable } from './showcase-table';
import styles from './showcase.module.scss';

export const DesignSystemShowcase = (): JSX.Element => {
	return (
		<div className={styles.canvas}>
			<div className={styles.shell}>
				<div className={styles.sidebarColumn}>
					<DesignSystemShowcaseSidebar />
				</div>

				<div className={styles.contentColumn}>
					<DesignSystemShowcaseActions />

					<DesignSystemShowcaseTable />
				</div>
			</div>
		</div>
	);
};
