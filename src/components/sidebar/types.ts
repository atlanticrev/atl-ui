import type { ReactElement, ReactNode } from 'react';

export type SidebarItem = {
	icon: ReactElement;
	key: string;
	label: string;
};

export type AtlSidebarProps = {
	className?: string;
	collapsed?: boolean;
	footer?: ReactNode;
	footerItems?: SidebarItem[];
	header?: ReactNode;
	items: SidebarItem[];
	loading?: boolean;
	onItemClick?: (key: string) => void;
	selectedKey?: string;
	testId: string;
};
