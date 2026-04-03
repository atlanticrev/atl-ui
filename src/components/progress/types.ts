import type { ReactNode } from 'react';

export type AtlProgressStatus =
	| 'default'
	| 'running'
	| 'completed'
	| 'failed'
	| 'aborted';

export type AtlProgressSize = 'sm' | 'md';

export type AtlProgressProps = {
	ariaLabel?: string;
	className?: string;
	indeterminate?: boolean;
	label?: ReactNode;
	max?: number;
	showValue?: boolean;
	size?: AtlProgressSize;
	status?: AtlProgressStatus;
	testId?: string;
	value?: number | null;
};
