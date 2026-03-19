import { clsx } from '@/lib/clsx';

import type { AtlSidebarProps, SidebarItem } from './types';

const SidebarButton = ({ collapsed, item, onClick, selected }: { collapsed: boolean; item: SidebarItem; onClick?: (key: string) => void; selected: boolean; }): JSX.Element => {
	return (
		<button className={clsx('atl-sidebar__item', selected && 'atl-sidebar__item--selected')} type="button" onClick={() => onClick?.(item.key)}>
			{item.icon}
			{!collapsed && <span>{item.label}</span>}
		</button>
	);
};

export const AtlSidebar = ({ collapsed = false, footer, footerItems = [], items, loading = false, onItemClick, selectedKey, testId }: AtlSidebarProps): JSX.Element => {
	return (
		<aside className={clsx('atl-sidebar', collapsed && 'atl-sidebar--collapsed')} data-testid={testId}>
			<div className="atl-sidebar__group">
				{loading && <span className="atl-sidebar__loading">Loading…</span>}
				{items.map((item) => <SidebarButton collapsed={collapsed} item={item} key={item.key} selected={item.key === selectedKey} onClick={onItemClick} />)}
			</div>
			<div className="atl-sidebar__group">
				{footerItems.map((item) => <SidebarButton collapsed={collapsed} item={item} key={item.key} selected={item.key === selectedKey} onClick={onItemClick} />)}
				{footer}
			</div>
		</aside>
	);
};
