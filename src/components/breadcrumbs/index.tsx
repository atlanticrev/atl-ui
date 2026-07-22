import { AtlButton } from '@/components/button';
import { ChevronDownIcon } from '@/icons/chevron-down-icon';
import { clsx } from '@/lib/clsx';

import type { AtlBreadcrumbsProps } from './types';

export const AtlBreadcrumbs = ({ className, items }: AtlBreadcrumbsProps): JSX.Element => {
	return (
		<nav
			aria-label="Breadcrumb"
			className={clsx('atl-breadcrumbs', className)}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<span
						className="atl-breadcrumbs__item"
						key={item.testId}
					>
						{item.onClick && !isLast ? (
							<AtlButton
								className="atl-breadcrumbs__trigger"
								data-testid={item.testId}
								size={24}
								variant="text"
								onClick={item.onClick}
							>
								{item.label}
							</AtlButton>
						) : (
							<span
								className={isLast ? 'atl-breadcrumbs__current' : undefined}
								data-testid={item.testId}
							>
								{item.label}
							</span>
						)}

						{!isLast && (
							<ChevronDownIcon
								size={16}
								style={{ transform: 'rotate(-90deg)' }}
							/>
						)}
					</span>
				);
			})}
		</nav>
	);
};
