import type { ReactElement, ReactNode } from 'react';

export type SidebarItem = {
	icon: ReactElement;
	key: string;
	label: string;
};

export type AtlSidebarProps = {
	collapsed?: boolean;
	footer?: ReactNode;
	footerItems?: SidebarItem[];
	items: SidebarItem[];
	loading?: boolean;
	onItemClick?: (key: string) => void;
	selectedKey?: string;
	testId: string;
};
