import type { SvgIconComponent } from '@/components/avatar/types';

export type ShowcaseAction = {
	icon: SvgIconComponent;
	key: string;
	title: string;
};

export type ShowcaseRecentFile = ShowcaseAction & {
	meta: string;
};

export type ShowcaseNavigationItem = {
	icon: SvgIconComponent;
	key: string;
	label: string;
};

export type ShowcaseFile = {
	author: {
		accent: string;
		email: string;
		initials: string;
		name: string;
	};
	icon: SvgIconComponent;
	id: string;
	meta: string;
	modifiedAt: string;
	title: string;
};
