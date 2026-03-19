import type { ReactNode } from 'react';

export type TabsSize = 40 | 32;

export type TabItem = {
	children?: ReactNode;
	disabled?: boolean;
	key: string;
	label: ReactNode;
};

export type AtlTabsProps = {
	activeKey: string;
	className?: string;
	contentClassName?: string;
	items: TabItem[];
	onChange: (key: string) => void;
	size?: TabsSize;
	testId: string;
};
