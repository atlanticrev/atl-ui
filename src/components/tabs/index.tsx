import { clsx } from '@/lib/clsx';

import type { AtlTabsProps } from './types';

export const AtlTabs = ({ activeKey, className, contentClassName, items, onChange, size = 40, testId }: AtlTabsProps): JSX.Element => {
	const activeTab = items.find((item) => item.key === activeKey);

	return (
		<div className={clsx('atl-tabs', className)} data-testid={testId}>
			<div className="atl-tabs__list" role="tablist">
				{items.map((item) => {
					const isActive = item.key === activeKey;

					return (
						<button aria-selected={isActive} className={clsx('atl-tabs__tab', `atl-tabs__tab--${size}`, isActive && 'atl-tabs__tab--active')} disabled={item.disabled} key={item.key} role="tab" type="button" onClick={() => onChange(item.key)}>
							{item.label}
						</button>
					);
				})}
			</div>

			<div className={contentClassName}>{activeTab?.children}</div>
		</div>
	);
};
