import { FileLineIcon } from '@/icons/file-line-icon';
import { GridLineIcon } from '@/icons/grid-line-icon';

import type { ShowcaseFile, ShowcaseRecentFile } from './showcase-types';

export const showcaseRecentFiles: ShowcaseRecentFile[] = [
	{
		key: 'requirements',
		title: 'Dashboard tech requirements',
		meta: '220 KB | docx',
		icon: FileLineIcon,
	},
	{ key: 'q4', title: 'Q4_2025 Reporting', meta: '1.2 MB | pdf', icon: FileLineIcon },
	{ key: 'fy', title: 'FY_2024-25 Financials', meta: '628 KB | xls', icon: GridLineIcon },
];

export const showcaseTableFiles: ShowcaseFile[] = [
	{
		id: 'requirements',
		title: 'Dashboard tech requirements',
		meta: '220 KB | docx',
		icon: FileLineIcon,
		modifiedAt: 'Jan 4, 2024',
		author: {
			initials: 'AL',
			name: 'Amelie Laurent',
			email: 'amelie@untitledui.com',
			accent: '#fde6d8',
		},
	},
	{
		id: 'marketing',
		title: 'Marketing site requirements',
		meta: '488 KB | docx',
		icon: FileLineIcon,
		modifiedAt: 'Jan 6, 2024',
		author: {
			initials: 'AF',
			name: 'Ammar Foley',
			email: 'ammar@untitledui.com',
			accent: '#e8ecff',
		},
	},
	{
		id: 'q4-reporting',
		title: 'Q4_2025 Reporting',
		meta: '1.2 MB | pdf',
		icon: FileLineIcon,
		modifiedAt: 'Jan 6, 2024',
		author: {
			initials: 'AL',
			name: 'Amelie Laurent',
			email: 'amelie@untitledui.com',
			accent: '#fde6d8',
		},
	},
	{
		id: 'q3-reporting',
		title: 'Q3_2025 Reporting',
		meta: '1.3 MB | pdf',
		icon: FileLineIcon,
		modifiedAt: 'Jan 8, 2024',
		author: {
			initials: 'SH',
			name: 'Sienna Hewitt',
			email: 'sienna@untitledui.com',
			accent: '#fff1d6',
		},
	},
	{
		id: 'q2-reporting',
		title: 'Q2_2025 Reporting',
		meta: '1.1 MB | pdf',
		icon: FileLineIcon,
		modifiedAt: 'Jan 8, 2024',
		author: {
			initials: 'OS',
			name: 'Olly Schroeder',
			email: 'olly@untitledui.com',
			accent: '#eef2d5',
		},
	},
	{
		id: 'fy-financials',
		title: 'FY_2024-25 Financials',
		meta: '628 KB | xls',
		icon: GridLineIcon,
		modifiedAt: 'Jan 4, 2024',
		author: {
			initials: 'ML',
			name: 'Mathilde Lewis',
			email: 'mathilde@untitledui.com',
			accent: '#f4dfe5',
		},
	},
];
