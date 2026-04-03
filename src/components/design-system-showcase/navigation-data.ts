import { BellLineIcon } from '@/icons/bell-line-icon';
import { CreditCardIcon } from '@/icons/credit-card-icon';
import { FileLineIcon } from '@/icons/file-line-icon';
import { FolderLineIcon } from '@/icons/folder-line-icon';
import { GridLineIcon } from '@/icons/grid-line-icon';
import { HomeLineIcon } from '@/icons/home-line-icon';
import { PieChartIcon } from '@/icons/pie-chart-icon';
import { SettingsLineIcon } from '@/icons/settings-line-icon';
import { TrashLineIcon } from '@/icons/trash-line-icon';
import { UsersPlusIcon } from '@/icons/users-plus-icon';

import type { ShowcaseAction, ShowcaseNavigationItem } from './showcase-types';

export const showcaseNavigationItems: ShowcaseNavigationItem[] = [
	{ key: 'home', label: 'Home', icon: HomeLineIcon },
	{ key: 'files', label: 'All files', icon: FolderLineIcon },
	{ key: 'private', label: 'Private files', icon: FolderLineIcon },
	{ key: 'shared', label: 'Shared with me', icon: UsersPlusIcon },
	{ key: 'deleted', label: 'Deleted files', icon: TrashLineIcon },
	{ key: 'design', label: 'Design', icon: PieChartIcon },
	{ key: 'notifications', label: 'Notifications', icon: BellLineIcon },
	{ key: 'billing', label: 'Plans & billing', icon: CreditCardIcon },
	{ key: 'settings', label: 'Settings', icon: SettingsLineIcon },
];

export const showcaseFolders: string[] = ["Sophie's files", 'Dashboard UI', 'Websites', 'Mobile apps'];

export const showcaseQuickActions: ShowcaseAction[] = [
	{ key: 'document', title: 'New document', icon: FileLineIcon },
	{ key: 'spreadsheet', title: 'New spreadsheet', icon: GridLineIcon },
	{ key: 'project', title: 'New project', icon: FolderLineIcon },
	{ key: 'team', title: 'New team', icon: UsersPlusIcon },
];
