import { AtlButton } from '@/components/button';
import { clsx } from '@/lib/clsx';

import type { AtlSidebarProps, SidebarItem } from './types';

type SidebarButtonProps = {
	collapsed: boolean;
	item: SidebarItem;
	onClick?: (key: string) => void;
	selected: boolean;
};

const SidebarButton = ({ collapsed, item, onClick, selected }: SidebarButtonProps): JSX.Element => {
	return (
		<AtlButton
			className={clsx('atl-sidebar__item', selected && 'atl-sidebar__item--selected')}
			iconLeft={item.icon}
			size={40}
			variant="text"
			onClick={() => onClick?.(item.key)}
		>
			{!collapsed && item.label}
		</AtlButton>
	);
};

export const AtlSidebar = ({
	className,
	collapsed = false,
	footer,
	footerItems = [],
	header,
	items,
	loading = false,
	onItemClick,
	selectedKey,
	testId,
}: AtlSidebarProps): JSX.Element => {
	return (
		<aside
			className={clsx('atl-sidebar', collapsed && 'atl-sidebar--collapsed', className)}
			data-testid={testId}
		>
			{header && <div className="atl-sidebar__header">{header}</div>}

			<div className="atl-sidebar__group">
				{loading && <span className="atl-sidebar__loading">Loading…</span>}

				{items.map((item) => (
					<SidebarButton
						collapsed={collapsed}
						item={item}
						key={item.key}
						onClick={onItemClick}
						selected={item.key === selectedKey}
					/>
				))}
			</div>

			<div className="atl-sidebar__group">
				{footerItems.map((item) => (
					<SidebarButton
						collapsed={collapsed}
						item={item}
						key={item.key}
						onClick={onItemClick}
						selected={item.key === selectedKey}
					/>
				))}

				{footer}
			</div>
		</aside>
	);
};
